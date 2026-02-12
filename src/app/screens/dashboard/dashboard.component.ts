import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  FileText, Users, CheckCircle, TrendingUp,
  Clock, Calendar, ArrowRight
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

  // Iconos para usar en el template fuera de los loops
  readonly icons = {
    ArrowRight, Clock, Calendar, Users
  };

  // 1. Datos de Estadísticas (Cards Superiores)
  readonly stats = [
    {
      label: 'Total Exams',
      value: '48',
      change: '+12%',
      icon: FileText,
      bg: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      label: 'Active Students',
      value: '1,234',
      change: '+8%',
      icon: Users,
      bg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      label: 'Completed Exams',
      value: '892',
      change: '+23%',
      icon: CheckCircle,
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Average Score',
      value: '78%',
      change: '+5%',
      icon: TrendingUp,
      bg: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
  ];

  // 2. Actividad Reciente (Tabla simulada)
  readonly recentActivity = [
    { student: 'Alice Johnson', exam: 'Mathematics Final', score: 95, time: '2 hours ago' },
    { student: 'Bob Smith', exam: 'Physics Midterm', score: 88, time: '3 hours ago' },
    { student: 'Carol White', exam: 'Chemistry Quiz', score: 92, time: '5 hours ago' },
    { student: 'David Brown', exam: 'Biology Test', score: 85, time: '6 hours ago' },
    { student: 'Eve Davis', exam: 'Mathematics Quiz', score: 78, time: '8 hours ago' },
  ];

  // 3. Próximos Exámenes
  readonly upcomingExams = [
    { title: 'Physics Final Exam', date: 'Jan 25, 2026', time: '10:00 AM', students: 45 },
    { title: 'Chemistry Midterm', date: 'Jan 27, 2026', time: '2:00 PM', students: 38 },
    { title: 'Mathematics Quiz', date: 'Jan 29, 2026', time: '11:00 AM', students: 52 },
  ];
}
