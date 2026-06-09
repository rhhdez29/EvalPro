import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { PaginationResult } from '../models/PaginationResult';
import { ExamBase, ExamDetail, ExamForm, ExamSummary } from '../models/RESTExamResponse.interface';
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
    console.log('Examen en el service ',exam);
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

    return this.http.get(`${this.apiUrl}${id}/`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let error = 'Ocurrió un error inesperado al obtener el examen.';


        if (err.error && err.error.error) {
          error = err.error.error;
        }
        else if (err.status === 400 || err.status === 401) {
          // A veces DRF manda los errores en un arreglo, o bajo la llave "detail" o "non_field_errors"
          if (err.error.non_field_errors) {
            error = err.error.non_field_errors[0];
          } else {
            error = 'Ocurrió un error inesperado al intentar obtener el examen.';
          }
        }
        return throwError(() => new Error(error));
      })
    )
  }

  deleteExam(id: number){
    return this.http.delete(this.apiUrl + id)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let error = 'Ocurrió un error inesperado al eliminar el examen.';


        if (err.error && err.error.error) {
          error = err.error.error;
        }
        else if (err.status === 400 || err.status === 401) {
          // A veces DRF manda los errores en un arreglo, o bajo la llave "detail" o "non_field_errors"
          if (err.error.non_field_errors) {
            error = err.error.non_field_errors[0];
          } else {
            error = 'Ocurrió un error inesperado al eliminar el examen.';
          }
        }
        return throwError(() => new Error(error));
      })
    )
  }

  updateExam(id: number, exam: ExamDetail){
    return this.http.put(`${this.apiUrl}${id}/`, exam)
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

  getStudentExamById(id: number){
    return this.http.get(`${this.apiUrl}${id}/take_exam/`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let error = 'Ocurrió un error inesperado al obtener el examen.';


        if (err.error && err.error.error) {
          error = err.error.error;
        }
        else if (err.status === 400 || err.status === 401) {
          if (err.error.non_field_errors) {
            error = err.error.non_field_errors[0];
          } else {
            error = 'Ocurrió un error inesperado al obtener el examen.';
          }
        }
        return throwError(() => new Error(error));
      })
    )
  }

  changeStatus(id: number, status: ExamBase['status']){
    let body = {}

    if(status === 'draft'){
      body = {
        status: 'scheduled'
      }
    }else if(status === 'scheduled'){
      body = {
        status: 'draft'
      }
    }

    console.log('status en service ' + status);
    console.log('body en service ' + body);

    return this.http.patch(this.apiUrl + id + '/change_status/', body)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let error = 'Ocurrió un error inesperado al cambiar el estado del examen.';


        if (err.error && err.error.error) {
          error = err.error.error;
        }
        else if (err.status === 400 || err.status === 401) {
          // A veces DRF manda los errores en un arreglo, o bajo la llave "detail" o "non_field_errors"
          if (err.error.non_field_errors) {
            error = err.error.non_field_errors[0];
          } else {
            error = 'Ocurrió un error inesperado al cambiar el estado del examen.';
          }
        }
        return throwError(() => new Error(error));
      })
    )
  }

}
