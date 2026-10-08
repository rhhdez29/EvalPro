import { Component, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { SubjectService } from '../../../../../services/subject.service';
import { AddStudentModalComponent } from "./components/add-student-modal/add-student-modal.component";
import { StudentListBySubject } from '../../../../../models/student-list-by-subject';
import { LoadingInformationComponent } from "../../../../../../../shared/components/loading-information/loading-information.component";
import { LoadingModalComponent } from "../../../../../../../shared/components/loading-modal/loading-modal.component";
import { PaginationComponent } from '../../../../../../../shared/components/pagination/pagination.component';

export interface Student {
  id: string;
  name: string;
  email: string;
  enrollment: string;
  avatar?: string;
}

const PAGE_SIZE = 10;

@Component({
  selector: 'students-tab',
  standalone: true,
  imports: [CommonModule, AddStudentModalComponent, LoadingModalComponent, PaginationComponent],
  templateUrl: './students-tab.component.html'
})
export class StudentsTabComponent {
  // Entrada
  subjectId = input.required<string>();

  // Servicio
  subjectService = inject(SubjectService);

  // Paginación
  currentPage = signal(1);

  // Estado Local (Signals)
  uploadedFile  = signal<File | null>(null);
  isDragging    = signal<boolean>(false);
  searchQuery   = signal<string>('');
  isAddStudentModalOpen = signal<boolean>(false);
  loadingStatus = signal<'oculto' | 'cargando' | 'exito' | 'error'>('oculto');
  loadingMessage1 = signal<string>('');
  loadingMessage2 = signal<string>('');

  // rxResource reactivo a subjectId + currentPage
  students = rxResource({
    params: () => ({ subjectId: this.subjectId(), page: this.currentPage() }),
    stream: ({ params }) => this.subjectService.getStudentsBySubject(params.subjectId, params.page)
  });

  // Paginación computed
  totalCount  = computed(() => this.students.value()?.count ?? 0);
  totalPages  = computed(() => Math.max(1, Math.ceil(this.totalCount() / PAGE_SIZE)));
  hasNext     = computed(() => !!this.students.value()?.next);
  hasPrevious = computed(() => !!this.students.value()?.previous);

  // Filtrado reactivo dentro de la página actual
  filteredStudents = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const results = this.students.value()?.results ?? [];
    if (!query) return results;

    return results.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.date_enrolled.toLowerCase().includes(query)
    );
  });

  // --- Paginación ---
  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  // --- Funciones para arrastrar y soltar archivos ---
  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.uploadedFile.set(event.dataTransfer.files[0]);
    }
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile.set(input.files[0]);
    }
  }

  // --- Acciones ---
  openModal() { this.isAddStudentModalOpen.set(true); }
  closeModal() { this.isAddStudentModalOpen.set(false); }

  addStudent(student: StudentListBySubject) {
    this.closeModal();
    this.loadingStatus.set('cargando');
    this.loadingMessage1.set('Agregando estudiante');
    this.loadingMessage2.set('Por favor espere...');

    this.subjectService.addStudentToSubject(this.subjectId(), student.email).subscribe({
      next: () => {
        this.loadingStatus.set('exito');
        this.loadingMessage1.set('Estudiante agregado');
        this.students.reload();

        setTimeout(() => {
          this.loadingStatus.set('oculto');
          this.loadingMessage1.set('');
          this.loadingMessage2.set('');
        }, 3000);
      },
      error: (error) => {
        this.loadingStatus.set('error');
        this.loadingMessage1.set('Error al agregar estudiante');
        this.loadingMessage2.set(error.message);

        setTimeout(() => {
          this.loadingStatus.set('oculto');
          this.loadingMessage1.set('');
          this.loadingMessage2.set('');
        }, 3000);
      }
    });
  }

  handleUpload() {
    const file = this.uploadedFile();
    if (file) {
      console.log('Procesando archivo:', file.name);
      this.uploadedFile.set(null);
    }
  }

  removeUploadedFile() { this.uploadedFile.set(null); }

  updateSearchQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  removeStudent(studentId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar a este estudiante de la materia?')) {
      this.loadingStatus.set('cargando');
      this.loadingMessage1.set('Eliminando estudiante');
      this.loadingMessage2.set('Por favor espere...');

      this.subjectService.removeStudentFromSubject(this.subjectId(), studentId).subscribe({
        next: () => {
          this.loadingStatus.set('exito');
          this.loadingMessage1.set('Estudiante eliminado');
          this.students.reload();

          setTimeout(() => {
            this.loadingStatus.set('oculto');
            this.loadingMessage1.set('');
            this.loadingMessage2.set('');
          }, 3000);
        },
        error: (error) => {
          this.loadingStatus.set('error');
          this.loadingMessage1.set('Error al eliminar estudiante');
          this.loadingMessage2.set(error.message);

          setTimeout(() => {
            this.loadingStatus.set('oculto');
            this.loadingMessage1.set('');
            this.loadingMessage2.set('');
          }, 3000);
        }
      });
    }
  }
}
