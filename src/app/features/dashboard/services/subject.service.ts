import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from './../../../../environments/environments';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RESTSubject } from '../models/RESTSubjectResponse.interface';
import { EditSubjectForm, Subject, } from '../models/subject.interface';
// import { SubjectMapper } from '../../../shared/mappers/subject-mapper';


import { PaginationResult } from '../models/PaginationResult';
import { StudentListBySubject } from '../models/student-list-by-subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  http = inject(HttpClient);

  apiUrl = `${environment.url_api}/subjects/`;


  // Obtener todas las materias
  getSubjects (): Observable<RESTSubject[]> {
    return this.http.get<PaginationResult<RESTSubject>>(this.apiUrl)
    .pipe(
      map((response) => response.results),
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
    );
  }

  // Crear una nueva materia
  createSubject(subjectData: any) {
    return this.http.post<any>(this.apiUrl, subjectData);
  }

  // Obtener una materia por su ID
  getSubjectById(id: string): Observable<Subject> {
    return this.http.get<Subject>(`${this.apiUrl}${id}/`);
  }

  updateSubject(id: number, subjectData: EditSubjectForm) {
    return this.http.put<any>(`${this.apiUrl}${id}/`, subjectData);
  }

  deleteSubject(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`)
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

  // Agregar estudiante a una materia
  addStudentToSubject(subjectId: string, email: string) {

    const body = {
      email: email
    }
    return this.http.post<any>(`${this.apiUrl}${subjectId}/add_student/`, body)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let error = 'Ocurrió un error inesperado al intentar agregar el estudiante.';


        if (err.error && err.error.error) {
          error = err.error.error;
        }
        else if (err.status === 400 || err.status === 401) {
          // A veces DRF manda los errores en un arreglo, o bajo la llave "detail" o "non_field_errors"
          if (err.error.non_field_errors) {
            error = err.error.non_field_errors[0];
          } else {
            error = 'Ocurrió un error inesperado al intentar aprobar la solicitud.';
          }
        }
        return throwError(() => new Error(error));
      })
    )

  }

  // Obtener estudiantes de una materia
  getStudentsBySubject(id: string): Observable<StudentListBySubject[]> {
    return this.http.get<StudentListBySubject[]>(`${this.apiUrl}${id}/enrolled_students/`)
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
