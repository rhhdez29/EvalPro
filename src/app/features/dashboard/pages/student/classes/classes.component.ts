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

export interface Class {
  id: string;
  name: string;
  code: string;
  teacher: string;
  schedule: string;
  nextExam?: string;
  color: string;
}

@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './classes.component.html'
})
export class ClassesComponent {

  private router = inject(Router);
  private studentService = inject(StudentService);
  // Mapeo de iconos para el HTML
  readonly icons = { BookOpen, Users, Calendar, Clock };

  // ESTADO BASE
  classes = rxResource({
    stream: () => this.studentService.getSubjects()
  })

  // ESTADOS DERIVADOS (Optimizados para calcularse solos)
  enrolledClassesCount = computed(() => this.classes.value()?.length);
  // upcomingExamsCount = computed(() => this.classes.value()?.filter(c => c.nextExam).length);

  // MÉTODOS
  handleClassClick(classId: string) {
    console.log(classId);
    this.router.navigate([`home/subject/${classId}`]);

  }
}
