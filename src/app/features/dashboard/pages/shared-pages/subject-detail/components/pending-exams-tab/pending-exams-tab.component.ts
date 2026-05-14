import { Component, input, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { SubjectService } from '../../../../../services/subject.service';
import { ExamDetail } from '../../../../../models/RESTExamResponse.interface';
import { ExamService } from '../../../../../services/exam.service';
import { ExamViewerComponent } from "../../../exam-viewer/exam-viewer.component";
import { map } from 'rxjs';
import { Router } from '@angular/router';

export interface PendingExam {
  id: string;
  title: string;
  dueDate: string;
  duration: number; // en minutos
  questions: number;
  attempts: number;
  maxAttempts: number;
  status: 'available' | 'in-progress' | 'overdue';
}

@Component({
  selector: 'app-pending-exams-tab',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe], // Proveedor para formatear fechas en el HTML
  templateUrl: './pending-exams-tab.component.html'
})
export class PendingExamsTabComponent {
  // Entrada
  subjectId = input.required<string>();

  private subjectService = inject(SubjectService);
  private router = inject(Router);

  // Estado Local (Simulado por ahora)
  exams =  rxResource({
    params: () => this.subjectId(),
    stream: () => this.subjectService.getStudentExams(this.subjectId()).pipe(
      map(response => {
        if (!response) return [];

        if(Array.isArray(response)) return response;

        return[];
      })
    )
  })

  // Contadores calculados (Reactivos)
  availableCount = computed(() => this.exams.value()?.filter(e => e.status === 'available').length || 0);
  inProgressCount = computed(() => this.exams.value()?.filter(e => e.status === 'in-progress').length || 0);
  overdueCount = computed(() => this.exams.value()?.filter(e => e.status === 'overdue').length || 0);

  // --- Helpers para la Vista ---

  getBadgeLabel(status: PendingExam['status']): string {
    const labels: Record<PendingExam['status'], string> = {
      'available': 'Disponible',
      'in-progress': 'En Progreso',
      'overdue': 'Vencido'
    };
    return labels[status];
  }

  formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Vencido';
    if (diffDays === 0) return 'Vence hoy';
    if (diffDays === 1) return 'Vence mañana';
    return `Vence en ${diffDays} días`;
  }

  // --- Acciones ---

  startExam(examId: number) {

    this.router.navigate([`/home/student/exam/${examId}`]);

  }

  handleContinueExam(examId: string) {
    console.log('Continuando examen:', examId);
    // TODO: Navegar a la interfaz de toma de examen (Router)
  }
}
