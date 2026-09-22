import { Component, input, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { SubjectService } from '../../../../../services/subject.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-my-grades-tab',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './my-grades-tab.component.html'
})
export class MyGradesTabComponent {
  subjectId = input.required<string>();

  private subjectService = inject(SubjectService);

  grades = rxResource({
    params: () => this.subjectId(),
    stream: () => this.subjectService.getStudentGrades(this.subjectId()).pipe(
      map(response => {
        if (!response) return [];
        if (Array.isArray(response)) return response;
        return [];
      })
    )
  });

  // Contadores
  completedCount = computed(() => this.grades.value()?.filter(g => g.status === 'completed').length || 0);
  pendingGradingCount = computed(() => this.grades.value()?.filter(g => g.status === 'needs_grading').length || 0);
  annulledCount = computed(() => this.grades.value()?.filter(g => g.status === 'annulled_by_fraud').length || 0);

  getBadgeLabel(status: string): string {
    const labels: Record<string, string> = {
      'completed': 'Completado',
      'needs_grading': 'En Calificación',
      'annulled_by_fraud': 'Anulado por fraude'
    };
    return labels[status] || status;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getScoreDisplay(grade: any): string {
    if (grade.status === 'annulled_by_fraud') return '0.00';
    if (grade.status === 'needs_grading') return 'Pendiente';
    return grade.score !== null ? grade.score : '-';
  }
}
