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

  // Mapeo de iconos para el HTML
  readonly icons = { BookOpen, Users, Calendar, Clock };

  // ESTADO BASE
  classes = signal<Class[]>([
    {
      id: '1',
      name: 'Advanced Mathematics',
      code: 'MATH-401',
      teacher: 'Prof. Johnson',
      schedule: 'Mon, Wed 10:00 AM',
      nextExam: 'Feb 20, 2026',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'Computer Science Fundamentals',
      code: 'CS-101',
      teacher: 'Dr. Smith',
      schedule: 'Tue, Thu 2:00 PM',
      nextExam: 'Feb 18, 2026',
      color: 'bg-purple-500'
    },
    {
      id: '3',
      name: 'Data Structures',
      code: 'CS-202',
      teacher: 'Prof. Williams',
      schedule: 'Mon, Fri 11:00 AM',
      color: 'bg-green-500'
    },
  ]);

  // ESTADOS DERIVADOS (Optimizados para calcularse solos)
  enrolledClassesCount = computed(() => this.classes().length);
  upcomingExamsCount = computed(() => this.classes().filter(c => c.nextExam).length);

  // MÉTODOS
  handleClassClick(classId: string) {
    this.router.navigate([`/app/subjects/${classId}`]);
  }
}
