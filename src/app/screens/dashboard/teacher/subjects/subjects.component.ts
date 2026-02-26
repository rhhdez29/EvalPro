import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { SubjectService } from '../../../../services/subject.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormSubjectComponent } from '../../shared/form-subject/form-subject.component';
import { CreateSubjectForm } from '../../../../shared/interfaces/subject.interface';
import { of, tap } from 'rxjs';

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
  imports: [CommonModule, LucideAngularModule, FormSubjectComponent],
  templateUrl: './subjects.component.html'
})
export class SubjectsComponent {

  private router = inject(Router);
  private subjectsService = inject(SubjectService);

  // Mapeo de iconos para el HTML
  readonly icons = { Plus, BookOpen, Users, FileText, MoreVertical, Edit, Trash2 };

  subjectCreatePayload = signal<CreateSubjectForm | null>(null);
  resfreshTrigger = signal(0);
  isLoading = signal(false);
  isModalOpen = signal(false);

  // ESTADOS DERIVADOS (Súper optimizados)

  totalSubjects = computed(() => (this.subjectsResource.value() || []).length);


  // rxResource se encarga de hacer la petición GET al inicializar el componente
  subjectsResource = rxResource({
    params: () => this.resfreshTrigger(),
    stream: () => this.subjectsService.getSubjects(),
  });

  // --- MÉTODOS ---


  handleSubjectClick(subjectId: string) {
    this.router.navigate([`/app/subjects/${subjectId}`]);
  }

  toggleModal() {
    this.isModalOpen.set(!this.isModalOpen());
  }

  createSubjectData(data: CreateSubjectForm){
    this.isLoading.set(true);

    this.subjectsService.createSubject(data).subscribe({
      next: () => {
        // 1. Cerramos el modal
        this.toggleModal();

        //Le decimos al recurso de lectura que vuelva a pedir los datos a Django
        this.subjectsResource.reload();

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  // Angular necesita recibir el $event explícitamente para detener la propagación
  handleMoreOptions(event: Event, subjectId: string) {
    event.stopPropagation(); // Evita que se dispare el click de la tarjeta (handleSubjectClick)
    console.log('More options for subject:', subjectId);
  }
}
