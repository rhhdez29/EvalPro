import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from './../../../../environments/environments';
import { catchError, Observable, throwError } from 'rxjs';
import { RESTSubject } from '../models/RESTSubjectResponse.interface';
import { EditSubjectForm, Subject, TeacherStats } from '../models/subject.interface';
// import { SubjectMapper } from '../../../shared/mappers/subject-mapper';


import { PaginationResult } from '../models/PaginationResult';
import { StudentListBySubject } from '../models/student-list-by-subject';
import { ExamBase, PendingExams } from '../models/RESTExamResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  http = inject(HttpClient);

  apiUrl = `${environment.url_api}/subjects/`;


  // Estadísticas de materias del usuario
  getTeacherStats(): Observable<TeacherStats> {
    return this.http.get<TeacherStats>(`${this.apiUrl}stats/`);
  }

  // Obtener todas las materias
  getSubjects(page: number = 1): Observable<PaginationResult<RESTSubject>> {
    return this.http.get<PaginationResult<RESTSubject>>(`${this.apiUrl}?page=${page}`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let error = 'Ocurrió un error inesperado al obtener las materias.';


        if (err.error && err.error.error) {
          error = err.error.error;
        }
        else if (err.status === 400 || err.status === 401) {
          // A veces DRF manda los errores en un arreglo, o bajo la llave "detail" o "non_field_errors"
          if (err.error.non_field_errors) {
            error = err.error.non_field_errors[0];
          } else {
            error = 'Ocurrió un error inesperado al intentar eliminar la materia.';
          }
        }
        return throwError(() => new Error(error));
      })
    );
  }

  // Obtener mis materias (solo las creadas por el usuario autenticado, incluye admin)
  getMySubjects(page: number = 1): Observable<PaginationResult<RESTSubject>> {
    return this.http.get<PaginationResult<RESTSubject>>(`${this.apiUrl}?mine=true&page=${page}`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let error = 'Ocurrió un error inesperado al obtener las materias.';
        if (err.error && err.error.error) {
          error = err.error.error;
        } else if (err.error && err.error.detail) {
          error = err.error.detail;
        }
        return throwError(() => new Error(error));
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
        let error = 'Ocurrió un error inesperado al intentar eliminar la materia.';


        if (err.error && err.error.error) {
          error = err.error.error;
        }
        else if (err.status === 400 || err.status === 401) {
          // A veces DRF manda los errores en un arreglo, o bajo la llave "detail" o "non_field_errors"
          if (err.error.non_field_errors) {
            error = err.error.non_field_errors[0];
          } else {
            error = 'Ocurrió un error inesperado al intentar eliminar la materia.';
          }
        }
        return throwError(() => new Error(error));
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

  // Eliminar estudiante de una materia
  removeStudentFromSubject(subjectId: string, studentId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${subjectId}/remove_student/${studentId}/`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          let error = 'Ocurrió un error inesperado al intentar eliminar el estudiante.';
          if (err.error && err.error.error) {
            error = err.error.error;
          }
          return throwError(() => new Error(error));
        })
      );
  }

  // Obtener estudiantes de una materia
  getStudentsBySubject(id: string, page: number = 1) {
    return this.http.get<PaginationResult<StudentListBySubject>>(`${this.apiUrl}${id}/enrolled_students/?page=${page}`)
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

  getStudentExams(id: string): Observable<PendingExams[]> {
    return this.http.get<PendingExams[]>(`${this.apiUrl}${id}/student_exams/`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let error = 'Ocurrió un error inesperado al intentar aprobar la solicitud.';


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

  getStudentGrades(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${id}/student_grades/`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let error = 'Ocurrió un error al obtener las calificaciones.';
        if (err.error && err.error.error) {
          error = err.error.error;
        }
        return throwError(() => new Error(error));
      })
    )
  }
}
