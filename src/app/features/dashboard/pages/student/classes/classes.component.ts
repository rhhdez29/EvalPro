import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  LucideAngularModule,
  BookOpen,
  Users,
  Calendar,
  Clock
} from 'lucide-angular';
import { rxResource } from '@angular/core/rxjs-interop';
import { StudentService } from '../../../services/student.service';
import { FacadeService } from '../../../../../core/services/facade.service';
import { Student } from '../../../../../core/models/user.inteface';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';

export interface Class {
  id: string;
  name: string;
  code: string;
  teacher: string;
  schedule: string;
  nextExam?: string;
  color: string;
}

const PAGE_SIZE = 10;

@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PaginationComponent],
  templateUrl: './classes.component.html'
})
export class ClassesComponent {

  private router          = inject(Router);
  private studentService  = inject(StudentService);
  private facadeService   = inject(FacadeService);

  readonly icons = { BookOpen, Users, Calendar, Clock };

  // Paginación
  currentPage = signal(1);

  // ESTADO BASE
  studentData = computed(() => this.facadeService.currentUser() as Student);

  classes = rxResource({
    params: () => this.currentPage(),
    stream: ({ params: page }) => this.studentService.getSubjects(page)
  });

  // Paginación computed
  totalCount  = computed(() => this.classes.value()?.count ?? 0);
  totalPages  = computed(() => Math.max(1, Math.ceil(this.totalCount() / PAGE_SIZE)));
  hasNext     = computed(() => !!this.classes.value()?.next);
  hasPrevious = computed(() => !!this.classes.value()?.previous);

  // Total global de clases inscritas (del backend)
  enrolledClassesCount = computed(() => this.classes.value()?.count ?? 0);

  // --- PAGINACIÓN ---
  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  // MÉTODOS
  handleClassClick(classId: string) {
    this.router.navigate([`home/subject/${classId}`]);
  }
}
