import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Trash2 } from 'lucide-angular';
import { ExamService } from '../../../services/exam.service';
import { DeleteModalComponent } from '../../../../../shared/components/delete-modal/delete-modal.component';
import { LoadingModalComponent } from '../../../../../shared/components/loading-modal/loading-modal.component';
import { ModalState } from '../../../../../core/models/ModalState';

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DeleteModalComponent, LoadingModalComponent],
  templateUrl: './exam-results.component.html'
})
export class ExamResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private examService = inject(ExamService);
  private location = inject(Location);

  examId: number | null = null;
  results = signal<any[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  isDeleteModalOpen = signal(false);
  studentToDelete: number | null = null;
  studentNameDelete = '';

  modalState = signal<ModalState>({
    status: 'oculto',
    title: '',
    subtitle: ''
  });

  readonly icons = { ArrowLeft, Trash2 };

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.examId = Number(id);
        this.loadResults();
      }
    });
  }

  loadResults() {
    if (!this.examId) return;
    this.isLoading.set(true);
    this.error.set(null);
    this.examService.getExamResults(this.examId).subscribe({
      next: (data) => {
        this.results.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar resultados');
        this.isLoading.set(false);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  openDeleteModal(studentId: number, studentName: string) {
    this.studentToDelete = studentId;
    this.studentNameDelete = studentName;
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    this.studentToDelete = null;
  }

  confirmDelete() {
    if (!this.examId || !this.studentToDelete) return;

    const studentId = this.studentToDelete;
    this.closeDeleteModal();
    this.modalState.set({
      status: 'cargando',
      title: 'Eliminando intento...',
      subtitle: 'Por favor espere.'
    });

    this.examService.deleteStudentAttempt(this.examId, studentId).subscribe({
      next: () => {
        this.modalState.set({
          status: 'exito',
          title: 'Intento eliminado correctamente.',
          subtitle: ''
        });
        setTimeout(() => {
          this.modalState.set({
            status: 'oculto',
            title: '',
            subtitle: ''
          });
          this.loadResults();
        }, 2000);
      },
      error: (err) => {
        this.modalState.set({
          status: 'error',
          title: 'Error al eliminar el intento.',
          subtitle: err.message || 'Error desconocido'
        });
        setTimeout(() => {
          this.modalState.set({
            status: 'oculto',
            title: '',
            subtitle: ''
          });
        }, 3000);
      }
    });
  }

  getStatusBadge(status: string) {
    switch (status) {
      case 'not_started': return { label: 'No iniciado', class: 'bg-gray-100 text-gray-700 border-gray-300' };
      case 'in_progress': return { label: 'En Progreso', class: 'bg-blue-100 text-blue-700 border-blue-300' };
      case 'needs_grading': return { label: 'Requiere Revisión', class: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
      case 'completed': return { label: 'Completado', class: 'bg-green-100 text-green-700 border-green-300' };
      case 'annulled_by_fraud': return { label: 'Anulado por fraude', class: 'bg-red-100 text-red-700 border-red-300' };
      case 'annulled': return { label: 'Anulado', class: 'bg-red-100 text-red-700 border-red-300' };
      default: return { label: status, class: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  }
}
