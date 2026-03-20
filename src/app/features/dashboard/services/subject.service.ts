import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from './../../../../environments/environments';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RESTSubject } from '../models/RESTSubjectResponse.interface';
import { Subject, } from '../models/subject.interface';
// import { SubjectMapper } from '../../../shared/mappers/subject-mapper';


import { PaginationResult } from '../models/PaginationResult';

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
}
