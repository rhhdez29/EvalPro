import { Component, input, output, signal, OnInit, OnDestroy, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExamDetail } from '../../../models/RESTExamResponse.interface';
import { CodeEditorViewerComponent } from "./components/code-editor-viewer/code-editor-viewer.component";
import { MatchingViewerComponent } from "./components/matching-viewer/matching-viewer.component";
import { MultipleChoiceViewerComponent } from "./components/multiple-choice-viewer/multiple-choice-viewer.component";
import { TrueFalseViewerComponent } from "./components/true-false-viewer/true-false-viewer.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { ExamService } from '../../../services/exam.service';
import { LoadingInformationComponent } from "../../../../../shared/components/loading-information/loading-information.component";
import { FacadeService } from '../../../../../core/services/facade.service';
import { of } from 'rxjs';

// Asume que ya tienes tus componentes hijos creados en Angular
// import { MultipleChoiceQuestionComponent } from '../questions/multiple-choice/multiple-choice.component';
// etc...

@Component({
  selector: 'exam-viewer',
  standalone: true,
  imports: [CommonModule, DatePipe, CodeEditorViewerComponent, MatchingViewerComponent, MultipleChoiceViewerComponent, TrueFalseViewerComponent, LoadingInformationComponent], // Importamos DatePipe para formatear la fecha fácil
  templateUrl: './exam-viewer.component.html'
})
export class ExamViewerComponent implements OnDestroy {
  // 1. Entradas (Inputs)
  id = input.required<string>();

  private examService = inject(ExamService);
  private facadeService = inject(FacadeService)

  // LA MAGIA: Si es true, es el maestro. Si es false, es el alumno.
  isPreviewMode = signal<boolean>(false);

  // 2. Salidas (Outputs)
  closeViewer = output<void>();
  submitExam = output<any>(); // Emitirá las respuestas del alumno

  // 3. Estado (Signals)
  timeRemaining = signal<number>(0);
  answeredQuestionsCount = signal<number>(0);

  // 4. Recursos
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

  // Calculado: Porcentaje de progreso
  progressPercentage = computed(() => {
    const total = this.examData().questions?.length || 1;
    return Math.round((this.answeredQuestionsCount() / total) * 100);
  });

  private timerInterval: any;

  ngAfterNextRender() {
    // Inicializamos el temporizador si el examen tiene duración
    const duration = this.examData().duration_minutes;
    if (duration > 0) {
      this.timeRemaining.set(duration * 60);
      this.startTimer();
    }
  }

  ngOnDestroy() {
    // Limpieza vital: detener el reloj si el componente se destruye
    this.stopTimer();
  }

  // --- Lógica del Reloj ---
  private startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining.update(time => {
        if (time <= 1) {
          this.stopTimer();
          this.autoSubmit();
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // --- Acciones ---
  onSubmitClick() {
    if (this.isPreviewMode()) {
      alert("Estás en Modo Vista Previa. La entrega está deshabilitada.");
      return;
    }

    // Aquí recolectarías las respuestas y las emitirías
    console.log("Enviando examen real...");
    this.submitExam.emit({ /* respuestas del alumno */ });
  }

  private autoSubmit() {
    if (!this.isPreviewMode()) {
      alert("¡El tiempo se ha agotado! Entregando examen automáticamente.");
      this.onSubmitClick();
    }
  }
}
