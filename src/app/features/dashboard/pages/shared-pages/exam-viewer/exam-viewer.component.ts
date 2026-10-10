import { Component, input, output, signal, computed, effect, inject, OnInit, OnDestroy, HostListener } from '@angular/core';

import { DatePipe, Location, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { MultipleChoiceViewerComponent } from './components/multiple-choice-viewer/multiple-choice-viewer.component';
import { TrueFalseViewerComponent } from './components/true-false-viewer/true-false-viewer.component';
import { MatchingViewerComponent } from './components/matching-viewer/matching-viewer.component';
import { CodeEditorViewerComponent } from './components/code-editor-viewer/code-editor-viewer.component';
import { X, Clock, FileText, AlertCircle, Eye, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of, tap, forkJoin, Subscription } from 'rxjs';
import { FacadeService } from '../../../../../core/services/facade.service';
import { ExamService } from '../../../services/exam.service';
import { ExamDetail } from '../../../models/RESTExamResponse.interface';
import { ExamSecurityService } from '../../../../../core/services/exam-security.service';
import { DEMO_EXAM_DATA } from '../../../../../shared/data/demo-exam.data';

import { ModalState } from '../../../../../core/models/ModalState';
import { LoadingModalComponent } from '../../../../../shared/components/loading-modal/loading-modal.component';

@Component({
  selector: 'exam-viewer',
  standalone: true,
  imports: [
    DatePipe,
    MultipleChoiceViewerComponent,
    TrueFalseViewerComponent,
    MatchingViewerComponent,
    CodeEditorViewerComponent,
    LucideAngularModule,
    NgClass,
    LoadingModalComponent
  ],
  templateUrl: './exam-viewer.component.html'
})
export class ExamViewerComponent implements OnInit, OnDestroy {
  // Inputs opcionales para permitir navegación demo sin parámetros de ruta
  id = input<string>();
  studentId = input<string>();
  isGradingMode = computed(() => !!this.studentId());
  studentAnswersData = signal<any[]>([]);

  private examService = inject(ExamService);
  private facadeService = inject(FacadeService);
  private location = inject(Location);
  private securityService = inject(ExamSecurityService);
  private router = inject(Router);

  // Detección reactiva del Modo Demo
  isDemoMode = computed(() => !this.id() || this.id() === 'demo' || this.router.url.includes('demo-exam'));

  isVoided = signal<boolean>(false);
  isExamFinished = false;
  shouldAllowExit = false;
  private voidSub!: Subscription;

  // Iconos disponibles para la vista
  icons = { X, Clock, FileText, AlertCircle, Eye, ChevronLeft, ChevronRight };

  // Estados locales (State)
  currentQuestionIndex = signal<number>(0);
  timeRemaining = signal<string>('00:00');
  isTimeUp = signal<boolean>(false);
  isPreviewMode = signal<boolean>(false);
  studentAnswers = signal<Map<number, any>>(new Map());
  gradingStatusMap = signal<Record<number, 'idle' | 'saving' | 'saved'>>({});
  submitError = signal<string | null>(null);
  modalState = signal<ModalState>({ status: 'oculto', title: '', subtitle: '' });

  timerInterval: any;

  exam = rxResource({
    params: () => ({ id: this.id(), studentId: this.studentId(), isDemo: this.isDemoMode() }),
    stream: ({params}) => {
      // Modo Demo: retornamos los datos estáticos e inicializamos el temporizador de 60 minutos
      if (params.isDemo) {
        this.isPreviewMode.set(false);
        const serverStartTime = new Date().toISOString();
        this.iniciarTemporizador(serverStartTime, DEMO_EXAM_DATA.duration_minutes);
        return of(DEMO_EXAM_DATA);
      }

      const role = this.facadeService.userRole();

      if (params.studentId) {
        this.isPreviewMode.set(true);
        return forkJoin({
          exam: this.examService.getExamByID(Number(params.id)),
          attempt: this.examService.getExamAttemptForGrading(params.id!, params.studentId)
        }).pipe(
          tap(res => {
            if (res.attempt.answers) {
              this.studentAnswersData.set(res.attempt.answers);
            }
          }),
          map(res => res.exam)
        );
      }

      if (role === 'maestro' || role === 'administrador') {
        this.isPreviewMode.set(true);
        return this.examService.getExamByID(Number(params.id!));
      }

      if (role === 'alumno') {
        this.isPreviewMode.set(false);
        return this.examService.getStudentExamById(Number(params.id!)).pipe(
          tap(response => {
            if (response && response.server_start_time) {
              this.iniciarTemporizador(response.server_start_time, response.duration_minutes, response.end_date);
            }
          })
        );
      }

      return of(null);
    }
  });

  examData = computed(() => (this.exam.value() || (this.isDemoMode() ? DEMO_EXAM_DATA : null)) as ExamDetail);
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    // Si no estamos en demo/preview y el examen no ha terminado ni se permite la salida limpia
    if (!this.shouldAllowExit && !this.isPreviewMode() && !this.isGradingMode() && !this.isExamFinished) {
      this.securityService.isUnloading = true;
      $event.returnValue = true;
    }
  }

  @HostListener('window:focus')
  @HostListener('document:click')
  onUserReturn(): void {
    if (this.securityService.isUnloading) {
      // El usuario canceló la recarga o hizo clic para volver al examen
      this.securityService.isUnloading = false;
    }
  }

  constructor() {
    effect(() => {
      const err = this.exam.error() as any;
      if (err) {
        this.isExamFinished = true;
        this.securityService.isExamFinished = true;
        const errorMsg = err?.error?.detail || err?.error?.error || err?.message || 'Este examen ya fue completado o anulado. No puedes volver a ingresar.';
        alert(errorMsg);
        this.router.navigate(['/home/student/classes']); 
      }
    });
  }

  ngOnInit() {
    if (this.isDemoMode()) {
      // Activar seguridad anti-fraude en modo demo
      this.securityService.startExamSecurity('demo');
    } else {
      const role = this.facadeService.userRole();
      if (role === 'alumno' && this.id()) {
        this.securityService.startExamSecurity(this.id()!);
      }
    }

    this.voidSub = this.securityService.examVoided$.subscribe(() => {
      this.isVoided.set(true);
    });
  }

  // 1. Ordenar preguntas strictly por la propiedad 'order'
  sortedQuestions = computed(() => {
    const questions = this.examData()?.questions || [];
    return [...questions].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  });

  // 2. Obtener la pregunta actual
  currentQuestion = computed(() => {
    return this.sortedQuestions()[this.currentQuestionIndex()];
  });

  // 3. Total de preguntas
  totalQuestions = computed(() => this.sortedQuestions().length);

  // 4. Porcentaje de progreso
  progressPercentage = computed(() => {
    if (!this.totalQuestions()) return 0;
    return Math.round(((this.currentQuestionIndex() + 1) / this.totalQuestions()) * 100);
  });

  progressWidth = computed(() => {
    if (!this.totalQuestions()) return 0;
    return ((this.currentQuestionIndex() + 1) / this.totalQuestions()) * 100;
  });

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  goToQuestion(index: number) {
    if (index >= 0 && index < this.totalQuestions()) {
      this.currentQuestionIndex.set(index);
    }
  }

  isQuestionAnswered(question: any): boolean {
    if (!question || question.id === undefined || question.id === null) return false;
    const ans = this.studentAnswers().get(question.id);

    if (ans === undefined || ans === null) return false;

    if (question.question_type === 'MCQ') {
      return Array.isArray(ans) && ans.length > 0;
    }
    if (question.question_type === 'TF') {
      return typeof ans === 'boolean';
    }
    if (question.question_type === 'MATCH') {
      if (ans instanceof Map) return ans.size > 0;
      if (typeof ans === 'object') return Object.keys(ans).length > 0;
      return false;
    }
    if (question.question_type === 'CODE') {
      return typeof ans === 'string' && ans.trim().length > 0;
    }

    return true;
  }

  onAnswerChange(questionId: number, answer: any) {
    this.studentAnswers.update(currentMap => {
      const newMap = new Map(currentMap);
      newMap.set(questionId, answer);
      return newMap;
    });

    if (this.submitError()) {
      this.submitError.set(null);
    }
  }

  goToPrevious() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  goToNext() {
    if (this.currentQuestionIndex() < this.totalQuestions() - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    }
  }

  submitExam(isAutoSubmit: boolean = false) {
    this.isExamFinished = true;
    this.securityService.isExamFinished = true;
    // Validar que todas las preguntas estén contestadas (solo cuando el envío es manual por el usuario)
    if (!isAutoSubmit && !this.isPreviewMode() && !this.isGradingMode()) {
      const unanswered = this.sortedQuestions().filter(q => !this.isQuestionAnswered(q));

      if (unanswered.length > 0) {
        const cant = unanswered.length;
        const msg = cant === 1
          ? 'Debes contestar todas las preguntas antes de enviar el examen. (Falta 1 pregunta por responder)'
          : `Debes contestar todas las preguntas antes de enviar el examen. (Faltan ${cant} preguntas por responder)`;

        this.submitError.set(msg);
        return;
      }
    }

    this.submitError.set(null);

    // Si estamos en modo demo:
    if (this.isDemoMode()) {
      this.modalState.set({
        status: 'cargando',
        title: 'Enviando Examen',
        subtitle: 'Procesando tus respuestas...'
      });

      setTimeout(() => {
        this.modalState.set({
          status: 'exito',
          title: '¡Examen Completado!',
          subtitle: '¡Felicidades! Has completado el Examen Demo de EvalPro.'
        });

        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
          this.isExamFinished = true;
          this.securityService.stopExamSecurity();
          this.router.navigate(['/landing']);
        }, 2000);
      }, 1500);
      return;
    }

    if (this.isPreviewMode()) {
      alert("This is a preview - submission is disabled");
      return;
    }

    this.modalState.set({
      status: 'cargando',
      title: 'Enviando Examen',
      subtitle: 'Guardando tus respuestas en el servidor...'
    });

    const answersPayload: any[] = [];
    const questions = this.examData().questions;

    this.studentAnswers().forEach((answer, questionId) => {
      const q = questions.find((x: any) => x.id === questionId);
      if (!q) return;

      const answerObj: any = { question_id: questionId };

      if (q.question_type === 'MCQ') {
        const selectedIndices = answer as number[];
        if (selectedIndices && selectedIndices.length > 0) {
          answerObj.selected_option_id = q.options[selectedIndices[0]].id;
        }
      } else if (q.question_type === 'TF') {
        answerObj.text_response = answer ? 'true' : 'false';
      } else if (q.question_type === 'MATCH') {
        answerObj.text_response = JSON.stringify(answer);
      } else if (q.question_type === 'CODE') {
        answerObj.text_response = answer;
      }

      answersPayload.push(answerObj);
    });

    const payload = { 
      answers: answersPayload,
      is_auto_submitted: isAutoSubmit 
    };

    this.examService.submitStudentExam(Number(this.id()), payload).subscribe({
      next: () => {
        this.modalState.set({
          status: 'exito',
          title: '¡Examen Enviado!',
          subtitle: 'Tus respuestas han sido registradas con éxito.'
        });

        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
          this.isExamFinished = true;
          this.cleanupExamState();
          this.router.navigate(['/home/student/classes'], { queryParams: { subject: this.examData().subject } });
        }, 2000);
      },
      error: (err) => {
        const mensajeError = err.error?.detail || err.error?.error || err.message || 'Hubo un error al enviar el examen.';
        this.modalState.set({
          status: 'error',
          title: 'Error al Enviar',
          subtitle: mensajeError
        });

        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
        }, 3000);
      }
    });
  }

  getAnswerForQuestion(questionId: number) {
    return this.studentAnswersData().find(a => a.question === questionId || a.question_id === questionId);
  }

  getStudentAnswerForViewer(questionId: number) {
    if (this.isGradingMode()) {
      return this.getAnswerForQuestion(questionId);
    }
    return this.studentAnswers().get(questionId);
  }

  getGradingStatus(answerId: number): 'idle' | 'saving' | 'saved' {
    return this.gradingStatusMap()[answerId] || 'idle';
  }

  onGradeInputChange(answerId: number, inputElem?: HTMLInputElement) {
    const maxPoints = this.currentQuestion()?.points ?? 0;
    if (inputElem && +inputElem.value > Number(maxPoints)) {
      inputElem.value = maxPoints.toString();
    }
    if (this.gradingStatusMap()[answerId] === 'saved') {
      this.gradingStatusMap.update(map => ({ ...map, [answerId]: 'idle' }));
    }
  }

  saveGrade(answerId: number, points: number) {
    const maxPoints = this.currentQuestion()?.points ?? 0;
    if (points < 0 || !answerId) return;

    if (points > Number(maxPoints)) {
      alert(`La calificación no puede ser mayor que el puntaje máximo de la pregunta (${maxPoints} pts).`);
      return;
    }

    this.gradingStatusMap.update(map => ({ ...map, [answerId]: 'saving' }));

    this.examService.gradeStudentAnswer(answerId, points).subscribe({
      next: () => {
        this.studentAnswersData.update(answers =>
          answers.map(a => a.id === answerId ? { ...a, needs_manual_review: false, points_earned: points } : a)
        );
        this.gradingStatusMap.update(map => ({ ...map, [answerId]: 'saved' }));
      },
      error: (err) => {
        this.gradingStatusMap.update(map => ({ ...map, [answerId]: 'idle' }));
        alert('Error saving grade: ' + err.message);
      }
    });
  }

  formatQuestionType(type: string): string {
    return type?.replace('-', ' ') || '';
  }

  backPage() {
    this.location.back();
  }

  iniciarTemporizador(serverStartTimeIso: string, durationMinutes: number, endDateIso?: string): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const startTime = new Date(serverStartTimeIso).getTime();
    const endTimeByDuration = startTime + (durationMinutes * 60 * 1000);
    const endTimeByDeadline = endDateIso ? new Date(endDateIso).getTime() : Infinity;
    const endTime = Math.min(endTimeByDuration, endTimeByDeadline);

    this.timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(this.timerInterval);
        this.timeRemaining.set('00:00');
        this.isTimeUp.set(true);
        this.autoSubmit();
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const mDisplay = minutes < 10 ? '0' + minutes : minutes;
      const sDisplay = seconds < 10 ? '0' + seconds : seconds;

      this.timeRemaining.set(`${mDisplay}:${sDisplay}`);
    }, 1000);
  }

  autoSubmit(): void {
    this.submitExam(true);
  }

  private cleanupExamState() {
    this.shouldAllowExit = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.securityService.stopExamSecurity();
    if (this.voidSub) {
      this.voidSub.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.cleanupExamState();
  }

  exitVoidedExam() {
    this.isExamFinished = true;
    this.cleanupExamState();
    if (this.isDemoMode()) {
      this.router.navigate(['/landing']);
    } else {
      this.router.navigate(['/home/student/classes'], { queryParams: { subject: this.examData().subject } });
    }
  }
}
