import { Component, signal, computed, inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Plus,
  BookOpen,
  Users,
  FileText,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-angular';
import { SubjectService } from '../../../services/subject.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormSubjectComponent } from '../../../components/form-subject/form-subject.component';
import { CreateSubjectForm } from '../../../models/subject.interface';
import { of, tap } from 'rxjs';
import { LoadingModalComponent } from '../../../../../shared/components/loading-modal/loading-modal.component';

export interface Subject {
  id: string;
  name: string;
  code: string;
  students: number;
  exams: number;
  color: string;
}

@Component({
  selector: 'app-my-subjects',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormSubjectComponent, LoadingModalComponent],
  templateUrl: './subjects.component.html'
})
export class SubjectsComponent {

  private router = inject(Router);
  private subjectsService = inject(SubjectService);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Si estamos en el navegador, recargamos la data (ya que en SSR evitamos el HTTP)
    afterNextRender(() => {
      this.subjectsResource.reload();
    });
  }

  // Mapeo de iconos para el HTML
  readonly icons = { Plus, BookOpen, Users, FileText, MoreVertical, Edit, Trash2 };

  subjectCreatePayload = signal<CreateSubjectForm | null>(null);
  resfreshTrigger = signal(0);
  isLoading = signal(false);
  isModalOpen = signal(false);

  // Modales
  modalStatus = signal<'oculto' | 'cargando' | 'exito' | 'error'>('oculto');
  messageModal1 = signal<string>('');
  messageModal2 = signal<string>('');

  // ESTADOS DERIVADOS (Súper optimizados)

  totalSubjects = computed(() => (this.subjectsResource.value() || []).length);


  // rxResource se encarga de hacer la petición GET al inicializar el componente
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

  // --- MÉTODOS ---


  handleSubjectClick(subjectId: string) {
    this.router.navigate([`home/subject/${subjectId}`]);
  }

  toggleModal() {
    this.isModalOpen.set(!this.isModalOpen());
  }

  createSubjectData(data: CreateSubjectForm){

    this.modalStatus.set('cargando');
    this.messageModal1.set('Cargando');
    this.messageModal2.set('Estamos procesando tu solicitud...')

    this.subjectsService.createSubject(data).subscribe({
      next: () => {
        // 1. Cerramos el modal
        this.toggleModal();

        this.modalStatus.set('exito');
        this.messageModal1.set('Listo!');
        this.messageModal2.set('Materia creada con éxito');
        setTimeout(() => {
          this.modalStatus.set('oculto');
          //Le decimos al recurso de lectura que vuelva a pedir los datos a Django
          this.subjectsResource.reload();

        }, 3000);


      },
      error: (err) => {
        console.error(err);
        this.modalStatus.set('error');
        const mensajeError = err.error?.detail || 'Hubo un error en el servidor'

        this.messageModal1.set('Uy, algo salió mal...');
        this.messageModal2.set(mensajeError);

        setTimeout(() => {
          this.modalStatus.set('oculto');
        }, 3000);
      }
    });
  }

  // Angular necesita recibir el $event explícitamente para detener la propagación
  handleMoreOptions(event: Event, subjectId: string) {
    event.stopPropagation(); // Evita que se dispare el click de la tarjeta (handleSubjectClick)
    console.log('More options for subject:', subjectId);
    console.log(this.subjectsResource.value())
  }
}
