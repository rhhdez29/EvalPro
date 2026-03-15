import { Component, signal, computed, inject, linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CreateSubjectForm } from '../../../models/subject.interface';

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
  imports: [CommonModule, LucideAngularModule, FormsModule, FormSubjectComponent], // No olvides FormsModule
  templateUrl: './subject-management.component.html'
})
export class SubjectManagementComponent {

  private router = inject(Router);

  readonly icons = { Plus, BookOpen, Users, Search, Edit, Trash2 };

  private subjectsService = inject(SubjectService);

  // --- ESTADOS BASE ---
  searchQuery = signal('');
  isModalOpen = signal(false);
  isLoading = signal(false);
  subjects = linkedSignal(() => this.subjectsResource.value() || []);

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

  // 2. Estadísticas automáticas
  totalSubjects = computed(() => this.subjects().length);
  // totalStudents = computed(() => this.subjects().reduce((acc, s) => acc + s.students, 0));
  activeTeachers = computed(() => new Set(this.subjects().map(s => s.teacher_name)).size);
  departmentsCount = computed(() => new Set(this.subjects().map(s => s.department)).size);

  // --- RX RESOURCES ---
  subjectsResource = rxResource({
    stream: () => this.subjectsService.getSubjects(),
  });



  // --- MÉTODOS ---

  handleSubjectClick(subjectId: string) {
    this.router.navigate([`home/subject/${subjectId}`]);
  }

  handleEdit(event: Event, subjectId: string) {
    event.stopPropagation();
    console.log('Edit subject', subjectId);
  }

  handleDelete(event: Event, subjectId: string) {
    event.stopPropagation();
    console.log('Delete subject', subjectId);
  }

  toggleModal() {
    this.isModalOpen.set(!this.isModalOpen());
    console.log(this.subjects());
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
}
