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
  Users,
  BarChart2,
  AlertCircle,
  GraduationCap
} from 'lucide-angular';
import { TeacherService } from '../../../services/teacher.service';
import { TeacherPerformanceStatsResponse } from '../../../models/teacher-stats.interface';

@Component({
  selector: 'app-teacher-stats',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './teacher-stats.component.html'
})
export class TeacherStatsComponent {
  private teacherService = inject(TeacherService);

  readonly icons = {
    TrendingUp,
    Award,
    CheckCircle2,
    XCircle,
    BookOpen,
    Users,
    BarChart2,
    AlertCircle,
    GraduationCap
  };

  // Carga reactiva de estadísticas del profesor
  statsResource = rxResource<TeacherPerformanceStatsResponse, undefined>({
    stream: () => this.teacherService.getPerformanceStats()
  });

  stats = computed<TeacherPerformanceStatsResponse | undefined>(() => this.statsResource.value());
  isLoading = computed(() => this.statsResource.isLoading());
  hasError = computed(() => !!this.statsResource.error());

  reload() {
    this.statsResource.reload();
  }
}
