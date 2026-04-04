import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { PaginationResult } from '../models/PaginationResult';
import { ExamForm, ExamSummary } from '../models/RESTExamResponse.interface';
import { catchError, map, throwError } from 'rxjs';

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
    .pipe(
      map(res => res.results),
      catchError((err: HttpErrorResponse) => {
        let errorMsg = 'Ocurrio un error inesperado'

        if(err.status === 403){
          errorMsg = 'No tienes permiso para acceder a este recurso'
        }

        if(err.status === 404){
          errorMsg = 'No se encontro el recurso'
        }

        return throwError(() => new Error(errorMsg));
      })
    )
  }

  createExam(exam: ExamForm){
    return this.http.post(this.apiUrl, exam)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMsg = 'Ocurrio un error inesperado'

        if(err.status === 403){
          errorMsg = 'No tienes permiso para acceder a este recurso'
        }

        if(err.status === 404){
          errorMsg = 'No se encontro el recurso'
        }

        return throwError(() => new Error(errorMsg));
      })
    )
  }

  getExamByID(id: number){

    return this.http.get(this.apiUrl + id)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMsg = 'Ocurrio un error inesperado'

        if(err.status === 403){
          errorMsg = 'No tienes permiso para acceder a este recurso'
        }

        if(err.status === 404){
          errorMsg = 'No se encontro el recurso'
        }

        return throwError(() => new Error(errorMsg));
      })
    )
  }

  deleteExam(id: number){
    return this.http.delete(this.apiUrl + id)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMsg = 'Ocurrio un error inesperado'

        if(err.status === 403){
          errorMsg = 'No tienes permiso para acceder a este recurso'
        }

        if(err.status === 404){
          errorMsg = 'No se encontro el recurso'
        }

        return throwError(() => new Error(errorMsg));
      })
    )
  }

  updateExam(id: number, exam: ExamForm){
    return this.http.put(this.apiUrl + id, exam)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMsg = 'Ocurrio un error inesperado'

        if(err.status === 403){
          errorMsg = 'No tienes permiso para acceder a este recurso'
        }

        if(err.status === 404){
          errorMsg = 'No se encontro el recurso'
        }

        return throwError(() => new Error(errorMsg));
      })
    )
  }

}
