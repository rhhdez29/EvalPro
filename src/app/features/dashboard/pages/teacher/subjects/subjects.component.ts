import { Component, signal, computed, inject, PLATFORM_ID, afterNextRender, linkedSignal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { FacadeService } from '../../../../../core/services/facade.service';

import {
  LucideAngularModule,
  Plus,
  BookOpen,
  Users,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-angular';

import { SubjectService } from '../../../services/subject.service';

import { FormSubjectComponent } from '../../../components/form-subject/form-subject.component';
import { CreateSubjectForm, EditSubjectForm, Subject } from '../../../models/subject.interface';
import { LoadingModalComponent } from '../../../../../shared/components/loading-modal/loading-modal.component';
import { LoadingInformationComponent } from "../../../../../shared/components/loading-information/loading-information.component";
import { DeleteModalComponent } from "../../../../../shared/components/delete-modal/delete-modal.component";
import { ModalState } from '../../../../../core/models/ModalState';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';



@Component({
  selector: 'app-my-subjects',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    FormSubjectComponent,
    LoadingModalComponent,
    LoadingInformationComponent,
    DeleteModalComponent,
    PaginationComponent,
  ],
  templateUrl: './subjects.component.html'
})
export class SubjectsComponent {

  private router = inject(Router);
  private subjectsService = inject(SubjectService);
  private platformId = inject(PLATFORM_ID);
  private facadeService = inject(FacadeService);

  PAGE_SIZE = computed(() => this.facadeService.userRole() === 'administrador' ? 10 : 6);

  currentPage      = signal(1);
  isLoading        = signal(false);
  isModalOpen      = signal(false);
  isModalDeleteOpen = signal(false);
  isEditModalOpen  = signal(false);
  subjectToEdit    = signal<EditSubjectForm | null>(null);

  // Modales
  modalState = signal<ModalState>({
    status: 'oculto',
    title: '',
    subtitle: ''
  });

  // rxResource reactivo a currentPage
  subjectsResource = rxResource({
    params: () => this.currentPage(),
    stream: ({ params: page }) => {
      if (isPlatformBrowser(this.platformId)) {
        return this.subjectsService.getMySubjects(page);
      }
      return of({ count: 0, next: null, previous: null, results: [] });
    },
  });

  // rxResource de estadísticas (carga independiente)
  statsResource = rxResource({
    stream: () => {
      if (isPlatformBrowser(this.platformId)) {
        return this.subjectsService.getTeacherStats();
      }
      return of({ total_subjects: 0, total_students: 0, total_exams: 0 });
    },
  });

  subjects = linkedSignal(() => this.subjectsResource.value()?.results ?? []);

  // Paginación
  totalCount  = computed(() => this.subjectsResource.value()?.count ?? 0);
  totalPages  = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.PAGE_SIZE())));
  hasNext     = computed(() => !!this.subjectsResource.value()?.next);
  hasPrevious = computed(() => !!this.subjectsResource.value()?.previous);

  isSubjectsEmpty = computed(() => {
    const data = this.subjectsResource.value();
    if (!data) return false;
    return data.results.length === 0;
  });

  // Mapeo de iconos para el HTML
  readonly icons = { Plus, BookOpen, Users, FileText, MoreVertical, Edit, Trash2, AlertCircle };

  messageDelete = '¿Estas seguro de que deseas eliminar esta materia? Esta acción no se puede deshacer.';
  private idSubject: number | null = null;

  constructor() {
    afterNextRender(() => {
      this.subjectsResource.reload();
    });
  }

  // --- PAGINACIÓN ---
  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  // --- MÉTODOS ---
  handleSubjectClick(subjectId: string) {
    this.router.navigate([`home/subject/${subjectId}`]);
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
            this.subjectsResource.reload();
          }, 3000);
        },
        error: (err) => {
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
            this.subjectsResource.reload();
          }, 3000);
        },
        error: (err) => {
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

  handleMoreOptions(event: Event, subjectId: string) {
    event.stopPropagation();
  }

  deleteSubject() {
    this.modalState.set({
      status: 'cargando',
      title: 'Eliminando',
      subtitle: 'Estamos procesando tu solicitud...'
    });

    this.subjectsService.deleteSubject(this.idSubject!).subscribe({
      next: () => {
        this.modalState.set({
          status: 'exito',
          title: 'Listo!',
          subtitle: 'Materia eliminada con éxito'
        });
        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
          this.currentPage.set(1); // Reset a página 1
        }, 3000);
      },
      error: (err) => {
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

    this.closeDeleteModal();
  }

  openCreateSubjectModal(event: Event | null, id: number | null, subject: EditSubjectForm | null) {
    if (event) event.stopPropagation();
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

  openEditModal(event: Event, id: number, subject: EditSubjectForm) {
    event.stopPropagation();
    this.idSubject = id;
    this.isEditModalOpen.set(true);
    this.subjectToEdit.set(subject);
  }

  openDeleteModal(event: Event, id: number) {
    event.stopPropagation();
    this.idSubject = id;
    this.isModalDeleteOpen.set(true);
  }

  closeDeleteModal() {
    this.isModalDeleteOpen.set(false);
  }
}
