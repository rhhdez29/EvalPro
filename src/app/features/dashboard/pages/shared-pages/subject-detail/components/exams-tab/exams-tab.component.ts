import { Component, computed, effect, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import {
  LucideAngularModule,
  Plus,
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-angular';

import { ExamService } from '../../../../../services/exam.service';

import { ExamBase, ExamDetail } from '../../../../../models/RESTExamResponse.interface';

import { CreateExamFormComponent } from "../exam-builder/create-exam-form/create-exam-form.component";
import { LoadingInformationComponent } from "../../../../../../../shared/components/loading-information/loading-information.component";
import { DeleteModalComponent } from "../../../../../../../shared/components/delete-modal/delete-modal.component";

@Component({
  selector: 'app-exams-tab',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CreateExamFormComponent, LoadingInformationComponent, DeleteModalComponent],
  templateUrl: './exams-tab.component.html'
})
export class ExamsTabComponent {

  // Nuevo Input basado en Signal (Sustituye a @Input)
  // Al ser 'required', Angular te exigirá pasarlo desde el HTML padre
  subjectId = input.required<string>();


  private examService = inject(ExamService);
  private platformId = inject(PLATFORM_ID);

  // Estados
  showCreateForm = signal(false);
  isModalOpen = signal(false);
  isModalDeleteOpen = signal(false);
  isEditExam = signal(false);
  examToEdit = signal<ExamDetail | null>(null);

  isExamsEmpty = computed(() => {
    const data = this.examsResource.value()

    if(!data || !Array.isArray(data)) return false;

    return data.length === 0;

  })

  examsResource = rxResource({
    params: () => this.subjectId(),
    stream: () => {
      if(isPlatformBrowser(this.platformId)){
        return this.examService.getExamsBySubject(this.subjectId())
      }
      return of([])
    },
  });


  // Iconos
  readonly icons = { Plus, Calendar, Clock, MoreVertical, Edit, Trash2, Eye };

  private idExam: number | null = null;

  messageDelete = '¿Estas seguro de que deseas eliminar este examen? Esta acción no se puede deshacer.';

  constructor(){

  }

  ngAfterNextRender(){
    this.examsResource.reload();
    console.log(this.examsResource.value());
  }

  // En Angular evitamos devolver JSX/HTML desde el TS. Solo devolvemos las clases CSS.
  getStatusClasses(status: ExamBase['status']): string {
    const styles = {
      draft: 'bg-gray-100 text-gray-700 border-gray-300',
      scheduled: 'bg-blue-100 text-blue-700 border-blue-300',
      active: 'bg-green-100 text-green-700 border-green-300',
      completed: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    };
    return styles[status];
  }

  openCreateExamModal(id: number | null) {
    this.idExam = id;

    this.showCreateForm.set(true);

    if(id){
      this.isEditExam.set(true);

      this.examService.getExamByID(id).subscribe({
        next: (exam) => {
          this.examToEdit.set(exam as ExamDetail);
          console.log(this.examToEdit());
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }

  closeCreateExamModal(){
    this.showCreateForm.set(false);
    this.isEditExam.set(false);
    this.examToEdit.set(null);
  }

  handleSubmitExam() {

  }

  openDeleteModal(id: number){
    this.idExam = id;
    this.isModalDeleteOpen.set(true);
  }

  closeDeleteModal(){
    this.isModalDeleteOpen.set(false);
  }
  deleteExam(){
    console.log('Eliminando examen: ', this.idExam);

    this.examService.deleteExam(this.idExam!).subscribe({
      next: () => {
        this.examsResource.reload();
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.closeDeleteModal();
  }
}
