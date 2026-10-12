import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { TeacherPerformanceStatsResponse } from '../models/teacher-stats.interface';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.url_api}/`;

  getPerformanceStats(): Observable<TeacherPerformanceStatsResponse> {
    return this.http.get<TeacherPerformanceStatsResponse>(`${this.apiUrl}api/teacher/performance-stats/`);
  }
}
