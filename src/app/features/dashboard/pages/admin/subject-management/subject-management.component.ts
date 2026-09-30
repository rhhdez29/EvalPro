import { Component, signal, computed, inject, linkedSignal, afterNextRender, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Plus,
  BookOpen,
  Users,
  Search,
  Edit,
  Trash2
} from 'lucide-angular';
import { rxResource } from '@angular/core/rxjs-interop';
import { SubjectService } from '../../../services/subject.service';
import { FormSubjectComponent } from '../../../components/form-subject/form-subject.component';
import { CreateSubjectForm, EditSubjectForm } from '../../../models/subject.interface';
import { LoadingInformationComponent } from "../../../../../shared/components/loading-information/loading-information.component";
import { of } from 'rxjs';
import { DeleteModalComponent } from "../../../../../shared/components/delete-modal/delete-modal.component";
import { ModalState } from '../../../../../core/models/ModalState';
import { LoadingModalComponent } from "../../../../../shared/components/loading-modal/loading-modal.component";
import { PaginationComponent } from "../../../../../shared/components/pagination/pagination.component";

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  students: number;
  exams: number;
  department: string;
  color: string;
}

const PAGE_SIZE = 10;

@Component({
  selector: 'app-subject-management',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    FormsModule,
    FormSubjectComponent,
    LoadingInformationComponent,
    DeleteModalComponent,
    LoadingModalComponent,
    PaginationComponent,
  ],
  templateUrl: './subject-management.component.html'
})
export class SubjectManagementComponent {

  private router = inject(Router);

  readonly icons = { Plus, BookOpen, Users, Search, Edit, Trash2 };

  private platformId = inject(PLATFORM_ID);

  private subjectsService = inject(SubjectService);

  // --- ESTADOS BASE ---
  currentPage   = signal(1);
  searchQuery   = signal('');
  isModalOpen   = signal(false);
  isLoading     = signal(false);

  modalStatus   = signal<'oculto' | 'cargando' | 'exito' | 'error'>('oculto');
  messageModal1 = signal('');
  messageModal2 = signal('');

  isEditModalOpen = signal(false);
  idSubject = 0;
  subjectToEdit = signal<EditSubjectForm | null>(null);

  isModalDeleteOpen = signal(false);

  // --- RX RESOURCE reactivo a currentPage ---
  subjectsResource = rxResource({
    params: () => this.currentPage(),
    stream: ({ params: page }) => {
      if (isPlatformBrowser(this.platformId)) {
        return this.subjectsService.getSubjects(page);
      }
      return of({ count: 0, next: null, previous: null, results: [] });
    },
  });

  // linkedSignal apunta a results de la página actual
  subjects = linkedSignal(() => this.subjectsResource.value()?.results ?? []);

  // --- ESTADOS DERIVADOS ---

  // Filtro local dentro de la página actual
  filteredSubjects = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.subjects().filter((subject) =>
      subject.name.toLowerCase().includes(query) ||
      subject.code.toLowerCase().includes(query) ||
      subject.teacher_name.toLowerCase().includes(query)
    );
  });

  isSubjectsEmpty = computed(() => {
    const data = this.subjectsResource.value();
    if (!data) return false;
    return data.results.length === 0;
  });

  // Paginación
  totalCount  = computed(() => this.subjectsResource.value()?.count ?? 0);
  totalPages  = computed(() => Math.max(1, Math.ceil(this.totalCount() / PAGE_SIZE)));
  hasNext     = computed(() => !!this.subjectsResource.value()?.next);
  hasPrevious = computed(() => !!this.subjectsResource.value()?.previous);

  // Estadísticas (basadas en la página actual)
  totalSubjects    = computed(() => this.subjectsResource.value()?.count ?? 0);
  activeTeachers   = computed(() => new Set(this.subjects().map(s => s.teacher_name)).size);
  departmentsCount = computed(() => new Set(this.subjects().map(s => s.department)).size);

  // ---
  messageDelete = '¿Estas seguro de que deseas eliminar esta materia? Esta acción no se puede deshacer.';
  idSubjectToDelete = 0;

  modalState = signal<ModalState>({
    status: 'oculto',
    title: '',
    subtitle: ''
  });

  // --- MÉTODOS ---

  constructor() {
    afterNextRender(() => {
      this.subjectsResource.reload();
    });
  }

  // --- PAGINACIÓN ---
  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  handleSubjectClick(subjectId: string) {
    this.router.navigate([`home/subject/${subjectId}`]);
  }

  openCreateSubjectModal(event: Event | null, id: number | null, subject: EditSubjectForm | null) {
    if (event) {
      event.stopPropagation();
    }
    this.isModalOpen.set(true);
    if (id) {
      this.idSubject = id;
      this.isEditModalOpen.set(true);
      this.subjectToEdit.set(subject);
    } else {
      this.isEditModalOpen.set(false);
      this.subjectToEdit.set(null);
    }
  }

  closeCreateSubjectModal() {
    this.isModalOpen.set(false);
    this.isEditModalOpen.set(false);
    this.subjectToEdit.set(null);
  }

  openDeleteModal(event: Event, id: number) {
    event.stopPropagation();
    this.idSubject = id;
    this.isModalDeleteOpen.set(true);
  }

  closeDeleteModal() {
    this.isModalDeleteOpen.set(false);
  }

  deleteSubject() {
    console.log('Eliminando materia: ', this.idSubject);

    this.subjectsService.deleteSubject(this.idSubject!).subscribe({
      next: () => {
        this.currentPage.set(1); // Volver a página 1 tras eliminar
      },
      error: (err) => {
        console.error(err);
      }
    });

    this.closeDeleteModal();
  }

  createSubjectData(data: CreateSubjectForm) {

    this.modalState.set({
      status: 'cargando',
      title: 'Cargando',
      subtitle: 'Estamos procesando tu solicitud...'
    });

    if (this.isEditModalOpen()) {
      this.subjectsService.updateSubject(this.idSubject!, data).subscribe({
        next: () => {
          this.closeCreateSubjectModal();
          this.modalState.set({
            status: 'exito',
            title: 'Listo!',
            subtitle: 'Materia actualizada con éxito'
          });
          setTimeout(() => {
            this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
            this.currentPage.set(1); // Volver a página 1 tras editar
          }, 3000);
        },
        error: (err) => {
          console.error(err);
          this.modalState.set({
            status: 'error',
            title: 'Uy, algo salió mal...',
            subtitle: err.error?.detail || 'Hubo un error en el servidor'
          });
          setTimeout(() => {
            this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
          }, 3000);
        }
      });
    } else {
      this.subjectsService.createSubject(data).subscribe({
        next: () => {
          this.closeCreateSubjectModal();
          this.modalState.set({
            status: 'exito',
            title: 'Listo!',
            subtitle: 'Materia creada con éxito'
          });
          setTimeout(() => {
            this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
            this.currentPage.set(1); // Volver a página 1 tras crear
          }, 3000);
        },
        error: (err) => {
          console.error(err);
          this.modalState.set({
            status: 'error',
            title: 'Uy, algo salió mal...',
            subtitle: err.error?.detail || 'Hubo un error en el servidor'
          });
          setTimeout(() => {
            this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
          }, 3000);
        }
      });
    }
  }
}
