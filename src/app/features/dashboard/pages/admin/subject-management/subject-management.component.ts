import { Component, signal, computed, inject, linkedSignal, afterNextRender, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Importante para usar ngModel
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

@Component({
  selector: 'app-subject-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, FormSubjectComponent, LoadingInformationComponent, DeleteModalComponent, LoadingModalComponent], // No olvides FormsModule
  templateUrl: './subject-management.component.html'
})
export class SubjectManagementComponent {

  private router = inject(Router);

  readonly icons = { Plus, BookOpen, Users, Search, Edit, Trash2 };

  private platformId = inject(PLATFORM_ID);

  private subjectsService = inject(SubjectService);

  // --- ESTADOS BASE ---
  searchQuery = signal('');
  isModalOpen = signal(false);
  isLoading = signal(false);
  subjects = linkedSignal(() => this.subjectsResource.value() || []);
  resfreshTrigger = signal(0);


  modalStatus = signal<'oculto' | 'cargando' | 'exito' | 'error'>('oculto');
  messageModal1 = signal('');
  messageModal2 = signal('');

  isEditModalOpen = signal(false);
  idSubject = 0;
  subjectToEdit = signal<EditSubjectForm | null>(null);

  isModalDeleteOpen = signal(false);

  // --- ESTADOS DERIVADOS ---

  // 1. El filtro en tiempo real. Se actualiza solo si cambian los subjects o cambia el texto de búsqueda.
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

    if(!data || !Array.isArray(data)) return false;

    return data.length === 0;

  })

  // 2. Estadísticas automáticas
  totalSubjects = computed(() => this.subjects().length);
  // totalStudents = computed(() => this.subjects().reduce((acc, s) => acc + s.students, 0));
  activeTeachers = computed(() => new Set(this.subjects().map(s => s.teacher_name)).size);
  departmentsCount = computed(() => new Set(this.subjects().map(s => s.department)).size);

  // --- RX RESOURCES ---
  subjectsResource = rxResource({
    params: () => this.resfreshTrigger(),
    stream: () => {
      // Evitamos hacer la petición en el servidor (SSR) porque no tenemos la cookie ahí
      if (isPlatformBrowser(this.platformId)) {
        return this.subjectsService.getSubjects();
      }
      return of([]); // Retornamos vacío temporalmente en el servidor
    },
  });

  messageDelete = '¿Estas seguro de que deseas eliminar esta materia? Esta acción no se puede deshacer.'
  idSubjectToDelete = 0;

  modalState = signal<ModalState>({
    status: 'oculto',
    title: '',
    subtitle: ''
  });

  // --- MÉTODOS ---

  constructor() {
    // Si estamos en el navegador, recargamos la data (ya que en SSR evitamos el HTTP)
    afterNextRender(() => {
      this.subjectsResource.reload();
    });

  }

  handleSubjectClick(subjectId: string) {
    this.router.navigate([`home/subject/${subjectId}`]);
  }


  openCreateSubjectModal(event: Event | null, id: number | null, subject: EditSubjectForm | null){

      if(event){
        event.stopPropagation();
      }

      this.isModalOpen.set(true);
      if(id){
        this.idSubject = id;
        this.isEditModalOpen.set(true);
        this.subjectToEdit.set(subject);
      }else{
        this.isEditModalOpen.set(false);
        this.subjectToEdit.set(null);
      }
    }

  closeCreateSubjectModal(){
    this.isModalOpen.set(false);
    this.isEditModalOpen.set(false);
    this.subjectToEdit.set(null);
  }

  openDeleteModal(event: Event, id: number){
    event.stopPropagation();
    this.idSubject = id;
    this.isModalDeleteOpen.set(true);
  }

  closeDeleteModal(){
    this.isModalDeleteOpen.set(false);
  }

  deleteSubject(){
    console.log('Eliminando materia: ', this.idSubject);

    this.subjectsService.deleteSubject(this.idSubject!).subscribe({
      next: () => {
        this.subjectsResource.reload();
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.closeDeleteModal();

  }

  createSubjectData(data: CreateSubjectForm){

    this.modalState.set({
      status: 'cargando',
      title: 'Cargando',
      subtitle: 'Estamos procesando tu solicitud...'
    });

    if(this.isEditModalOpen()){
      this.subjectsService.updateSubject(this.idSubject!, data).subscribe({
        next: () => {
          this.closeCreateSubjectModal();
          this.modalState.set({
            status: 'exito',
            title: 'Listo!',
            subtitle: 'Materia actualizada con éxito'
          });
          setTimeout(() => {
            this.modalState.set({
              status: 'oculto',
              title: '',
              subtitle: ''
            });
            this.subjectsResource.reload();
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
            this.modalState.set({
              status: 'oculto',
              title: '',
              subtitle: ''
            });
          }, 3000);
        }
      });
    }else{

      this.subjectsService.createSubject(data).subscribe({
        next: () => {
        // 1. Cerramos el modal
        this.closeCreateSubjectModal();

        this.modalState.set({
          status: 'exito',
          title: 'Listo!',
          subtitle: 'Materia creada con éxito'
        });
        setTimeout(() => {
          this.modalState.set({
            status: 'oculto',
            title: '',
            subtitle: ''
          });
          //Le decimos al recurso de lectura que vuelva a pedir los datos a Django
          this.subjectsResource.reload();

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
          this.modalState.set({
            status: 'oculto',
            title: '',
            subtitle: ''
          });
        }, 3000);
      }
    });
  }
  }
}
