import { Component, input, output, signal, computed, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';
// Importa tus componentes de preguntas aquí
import { MultipleChoiceViewerComponent } from '../components/multiple-choice-viewer/multiple-choice-viewer.component';
import { TrueFalseViewerComponent } from '../components/true-false-viewer/true-false-viewer.component';
import { MatchingViewerComponent } from '../components/matching-viewer/matching-viewer.component';
import { CodeEditorViewerComponent } from '../components/code-editor-viewer/code-editor-viewer.component';
// Importa los iconos de Lucide (ajusta según tu librería)
import { X, Clock, FileText, AlertCircle, Eye, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of, tap } from 'rxjs';
import { FacadeService } from '../../../../../../core/services/facade.service';
import { ExamService } from '../../../../services/exam.service';
import { ExamDetail } from '../../../../models/RESTExamResponse.interface';
import { ExamSecurityService } from '../../../../../../core/services/exam-security.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'exam-viewer2',
  standalone: true,
  imports: [
    DatePipe,
    MultipleChoiceViewerComponent,
    TrueFalseViewerComponent,
    MatchingViewerComponent,
    CodeEditorViewerComponent,
    LucideAngularModule
],
  templateUrl: './exam-viewer2.component.html'
})
export class ExamPreviewComponent implements OnInit, OnDestroy {
  // Inputs y Outputs (Props en React)
  id = input.required<string>();
  private examService = inject(ExamService);
  private facadeService = inject(FacadeService)
  private location = inject(Location);
  private securityService = inject(ExamSecurityService);
  private router = inject(Router);

  isVoided = signal<boolean>(false);
  isExamFinished = false;
  private voidSub!: Subscription;

  // Iconos disponibles para la vista
  icons = { X, Clock, FileText, AlertCircle, Eye, ChevronLeft, ChevronRight };

  // Estados locales (State)
  currentQuestionIndex = signal<number>(0);
  timeRemaining = signal<string>('00:00');
  isTimeUp = signal<boolean>(false);
  isPreviewMode = signal<boolean>(false);
  studentAnswers = signal<Map<number, any>>(new Map());

  timerInterval: any;

  exam = rxResource({
    params: () => this.id(),
    stream: ({params}) => {

      const role = this.facadeService.userRole();

      if(role === 'maestro' || role === 'administrador'){
        this.isPreviewMode.set(true);
        return this.examService.getExamByID(Number(params))
      }

      if (role === 'alumno') {
        this.isPreviewMode.set(false);
        return this.examService.getStudentExamById(Number(params)).pipe(
          tap(response =>{
            console.log(response);
            if(response && response.server_start_time){
              this.iniciarTemporizador(response.server_start_time, response.duration_minutes);
            }
          })
        )

      }

      return of(null)
    }
  })

  examData = computed(() => this.exam.value()! as ExamDetail);

  constructor() {


  }

  ngOnInit() {
    const role = this.facadeService.userRole();
    if (role === 'alumno') {
      this.securityService.startExamSecurity(this.id());
    }

    this.voidSub = this.securityService.examVoided$.subscribe(() => {
      this.isVoided.set(true);
    });
  }

  // Lógica computada (useMemo en React)

  // 1. Ordenar preguntas estrictamente por la propiedad 'order'
  sortedQuestions = computed(() => {
    return [...this.examData().questions].sort((a: any, b: any) => a.order - b.order);
  });

  // 2. Obtener la pregunta actual
  currentQuestion = computed(() => {
    return this.sortedQuestions()[this.currentQuestionIndex()];
  });

  // 3. Total de preguntas
  totalQuestions = computed(() => this.sortedQuestions().length);

  // 4. Porcentaje de progreso (Evitamos cálculos complejos en el HTML)
  progressPercentage = computed(() => {
    return Math.round(((this.currentQuestionIndex() + 1) / this.totalQuestions()) * 100);
  });

  progressWidth = computed(() => {
    return ((this.currentQuestionIndex() + 1) / this.totalQuestions()) * 100;
  });

  // Métodos
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

  onAnswerChange(questionId: number, answer: any) {
    this.studentAnswers.update(currentMap => {
      const newMap = new Map(currentMap);
      newMap.set(questionId, answer);
      return newMap;
    });
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

  submitExam() {
    if(this.isPreviewMode()){
      alert("This is a preview - submission is disabled");
      return;
    }

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

    const payload = { answers: answersPayload };

    console.log(payload);


    this.examService.submitStudentExam(Number(this.id()), payload).subscribe({
      next: (res) => {
        this.isExamFinished = true;
        this.router.navigate(['/home/student/classes']);
      },
      error: (err) => {
        alert("Error submitting exam: " + err.message);
      }
    });

  }

  // Utilidad para limpiar el tipo de pregunta en el UI (ej. multiple-choice -> multiple choice)
  formatQuestionType(type: string): string {
    return type?.replace('-', ' ') || '';
  }

  backPage(){

    this.location.back();

  }

  iniciarTemporizador(serverStartTimeIso: string, durationMinutes: number): void {

    //Limpieza de seguridad: Destruir el reloj anterior si existe
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const startTime = new Date(serverStartTimeIso).getTime();
    const endTime = startTime + (durationMinutes * 60 * 1000);

    this.timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      console.log('now', now);
      console.log('distance', distance);

      if (distance <= 0) {
        clearInterval(this.timerInterval);

        // 🌟 Actualizamos el estado usando .set()
        this.timeRemaining.set('00:00');
        this.isTimeUp.set(true);

        this.autoSubmit();
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const mDisplay = minutes < 10 ? '0' + minutes : minutes;
      const sDisplay = seconds < 10 ? '0' + seconds : seconds;

      // 🌟 Actualizamos el texto reactivo en la vista sin disparar Change Detection global
      this.timeRemaining.set(`${mDisplay}:${sDisplay}`);
    }, 1000);
  }

  autoSubmit(): void {
    console.log("El tiempo se agotó. Enviando respuestas automáticamente...");
    this.submitExam();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    this.securityService.stopExamSecurity();
    if (this.voidSub) {
      this.voidSub.unsubscribe();
    }
  }

  exitVoidedExam() {
    this.isExamFinished = true; // Permitir que el Guard nos deje salir
    this.router.navigate(['/home/student/classes']);
  }
}
