import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  LucideAngularModule,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  BookOpen,
  Calendar,
  GraduationCap,
  Clock,
  ArrowUpRight,
  BarChart2,
  AlertCircle
} from 'lucide-angular';
import { StudentService } from '../../../services/student.service';
import { StudentStatsResponse } from '../../../models/student-stats.interface';

@Component({
  selector: 'app-student-performance',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './student-performance.component.html'
})
export class StudentPerformanceComponent {
  private studentService = inject(StudentService);

  readonly icons = {
    TrendingUp,
    Award,
    CheckCircle2,
    XCircle,
    BookOpen,
    Calendar,
    GraduationCap,
    Clock,
    ArrowUpRight,
    BarChart2,
    AlertCircle
  };

  // Carga reactiva con rxResource usando stream
  statsResource = rxResource<StudentStatsResponse, undefined>({
    stream: () => this.studentService.getStudentStats()
  });

  stats = computed<StudentStatsResponse | undefined>(() => this.statsResource.value());
  isLoading = computed(() => this.statsResource.isLoading());
  hasError = computed(() => !!this.statsResource.error());

  reload() {
    this.statsResource.reload();
  }
}
