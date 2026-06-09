import { Component, input, output, signal, computed, effect, inject } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
// Importa tus componentes de preguntas aquí
import { MultipleChoiceViewerComponent } from '../components/multiple-choice-viewer/multiple-choice-viewer.component';
import { TrueFalseViewerComponent } from '../components/true-false-viewer/true-false-viewer.component';
import { MatchingViewerComponent } from '../components/matching-viewer/matching-viewer.component';
import { CodeEditorViewerComponent } from '../components/code-editor-viewer/code-editor-viewer.component';
// Importa los iconos de Lucide (ajusta según tu librería)
import { X, Clock, FileText, AlertCircle, Eye, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { FacadeService } from '../../../../../../core/services/facade.service';
import { ExamService } from '../../../../services/exam.service';
import { ExamDetail } from '../../../../models/RESTExamResponse.interface';

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
export class ExamPreviewComponent {
  // Inputs y Outputs (Props en React)
  id = input.required<string>();
  private examService = inject(ExamService);
  private facadeService = inject(FacadeService)
  private location = inject(Location);

  // Iconos disponibles para la vista
  icons = { X, Clock, FileText, AlertCircle, Eye, ChevronLeft, ChevronRight };

  // Estados locales (State)
  currentQuestionIndex = signal<number>(0);
  timeRemaining = signal<number>(0);
  isPreviewMode = signal<boolean>(false);

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
        return this.examService.getStudentExamById(Number(params))
      }

      return of(null)
    }
  })

  examData = computed(() => this.exam.value()! as ExamDetail);

  constructor() {

    // Inicializamos el temporizador de forma reactiva cuando llegue la data
    effect(() => {
      if (this.examData()) {
        this.timeRemaining.set(this.examData().duration_minutes * 60);
      }
    }, { allowSignalWrites: true });
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



  }

  // Utilidad para limpiar el tipo de pregunta en el UI (ej. multiple-choice -> multiple choice)
  formatQuestionType(type: string): string {
    return type?.replace('-', ' ') || '';
  }

  backPage(){

    this.location.back();

  }
}
