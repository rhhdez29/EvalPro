import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { PaginationResult } from '../models/PaginationResult';
import { ExamSummary } from '../models/RESTExamResponse.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.url_api}/exams/`

  getExamsBySubject(subjectId: number|string){
    console.log(subjectId)
    const param = new HttpParams().set('subject', subjectId.toString());
    return this.http.get<PaginationResult<ExamSummary>>(this.apiUrl, {params: param})
    .pipe(map(res => res.results)

  )
  }

}
