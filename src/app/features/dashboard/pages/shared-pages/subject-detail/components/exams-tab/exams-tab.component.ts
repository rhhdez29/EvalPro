import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CreateExamFormComponent, ExamFormData } from '../../../../forms/create-exam-form/create-exam-form.component';
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
import { rxResource } from '@angular/core/rxjs-interop';
import { ExamService } from '../../../../../services/exam.service';
import { CreateExamFormComponent } from "../create-exam-form/create-exam-form.component";

export interface Exam {
  id: string;
  title: string;
  date: string;
  duration: number; // en minutos
  questions: number;
  submissions: number;
  totalStudents: number;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
}

@Component({
  selector: 'app-exams-tab',
  standalone: true,
  // Asegúrate de importar el CreateExamFormComponent cuando lo tengas listo
  imports: [CommonModule, LucideAngularModule, CreateExamFormComponent],
  templateUrl: './exams-tab.component.html'
})
export class ExamsTabComponent {

  // Nuevo Input basado en Signal (Sustituye a @Input)
  // Al ser 'required', Angular te exigirá pasarlo desde el HTML padre
  subjectId = input.required<string>();

  examService = inject(ExamService);

  // Iconos
  readonly icons = { Plus, Calendar, Clock, MoreVertical, Edit, Trash2, Eye };

  // Estados
  showCreateForm = signal(false);
  isModalOpen = signal(false);

  examsResource = rxResource({
    params: () => this.subjectId(),
    stream: () => this.examService.getExamsBySubject(this.subjectId()),
  });

  constructor(){
    effect(() => {
      // Esto se imprimirá varias veces: primero cuando esté cargando, luego cuando lleguen los datos.
      console.log('¿Está cargando?', this.examsResource.isLoading());
      console.log('Datos que tiene Angular en la mano:', this.examsResource.value());

      if (this.examsResource.error()) {
        console.error('Hubo un error interno:', this.examsResource.error());
      }
    });
  }
  // En Angular evitamos devolver JSX/HTML desde el TS. Solo devolvemos las clases CSS.
  getStatusClasses(status: Exam['status']): string {
    const styles = {
      draft: 'bg-gray-100 text-gray-700 border-gray-300',
      scheduled: 'bg-blue-100 text-blue-700 border-blue-300',
      active: 'bg-green-100 text-green-700 border-green-300',
      completed: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    };
    return styles[status];
  }

  handleCreateExam() {
    this.showCreateForm.set(!this.showCreateForm());
  }

  handleSubmitExam() {

  }
}
