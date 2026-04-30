import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { Subject } from '../models/subject.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PaginationResult } from '../models/PaginationResult';
import { RESTSubject } from '../models/RESTSubjectResponse.interface';
import { StudentListBySubject } from '../models/student-list-by-subject';

@Injectable({
  providedIn: 'root'
})


export class StudentService {

  apiUrl = `${environment.url_api}/`;

  http = inject(HttpClient);

  getSubjects(){
    return this.http.get<PaginationResult<RESTSubject>>(`${this.apiUrl}subjects/`)
    .pipe(
      map(response => {
        console.log(response.results)
        return response.results
      })
    )
  }

  searchStudentByEmail(email: string){
    return this.http.get<StudentListBySubject>(`${this.apiUrl}students/?email=${email}`)
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


}
