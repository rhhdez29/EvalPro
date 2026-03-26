import { Component, signal, computed, inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, tap } from 'rxjs';

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
@Component({
  selector: 'app-my-subjects',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormSubjectComponent, LoadingModalComponent, LoadingInformationComponent, DeleteModalComponent],
  templateUrl: './subjects.component.html'
})
export class SubjectsComponent {

  private router = inject(Router);
  private subjectsService = inject(SubjectService);
  private platformId = inject(PLATFORM_ID);

  resfreshTrigger = signal(0);
  isLoading = signal(false);
  isModalOpen = signal(false);
  isModalDeleteOpen = signal(false);
  isEditModalOpen = signal(false);
  subjectToEdit = signal<EditSubjectForm | null>(null);

  // Modales
  modalStatus = signal<'oculto' | 'cargando' | 'exito' | 'error'>('oculto');
  messageModal1 = signal<string>('');
  messageModal2 = signal<string>('');

  isSubjectsEmpty = computed(() => {

    const data = this.subjectsResource.value();

    if(!data || !Array.isArray(data)) return false;

    return data.length === 0;

  })

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

  // Mapeo de iconos para el HTML
  readonly icons = { Plus, BookOpen, Users, FileText, MoreVertical, Edit, Trash2, AlertCircle };

  messageDelete = '¿Estas seguro de que deseas eliminar esta materia? Esta acción no se puede deshacer.';
  private idSubject: number | null = null;


  constructor() {
    // Si estamos en el navegador, recargamos la data (ya que en SSR evitamos el HTTP)
    afterNextRender(() => {
      this.subjectsResource.reload();
    });

  }
  // --- MÉTODOS ---


  handleSubjectClick(subjectId: string) {
    this.router.navigate([`home/subject/${subjectId}`]);
  }

  createSubjectData(data: CreateSubjectForm){

    this.modalStatus.set('cargando');
    this.messageModal1.set('Cargando');
    this.messageModal2.set('Estamos procesando tu solicitud...')

    if(this.isEditModalOpen()){
      this.subjectsService.updateSubject(this.idSubject!, data).subscribe({
        next: () => {
          this.closeCreateSubjectModal();
          this.modalStatus.set('exito');
          this.messageModal1.set('Listo!');
          this.messageModal2.set('Materia actualizada con éxito');
          setTimeout(() => {
            this.modalStatus.set('oculto');
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
    }else{

      this.subjectsService.createSubject(data).subscribe({
        next: () => {
        // 1. Cerramos el modal
        this.closeCreateSubjectModal();

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
  }

  // Angular necesita recibir el $event explícitamente para detener la propagación
  handleMoreOptions(event: Event, subjectId: string) {
    event.stopPropagation(); // Evita que se dispare el click de la tarjeta (handleSubjectClick)
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

  openEditModal(event: Event, id: number, subject: EditSubjectForm){
    event.stopPropagation();
    this.idSubject = id;
    this.isEditModalOpen.set(true);
    this.subjectToEdit.set(subject);
  }

  openDeleteModal(event: Event, id: number){
    event.stopPropagation();
    this.idSubject = id;
    this.isModalDeleteOpen.set(true);

  }

  closeDeleteModal(){
    this.isModalDeleteOpen.set(false);
  }
}
