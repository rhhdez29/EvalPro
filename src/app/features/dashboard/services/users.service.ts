import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { UserList } from '../models/UserList.interface';
import { PaginationResult } from '../models/PaginationResult';
import { catchError, map, throwError } from 'rxjs';
import { TeacherValidation } from '../../../core/models/user.inteface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  http = inject(HttpClient)

  apiUrl = 'http://127.0.0.1:8000/users/'

  pendingTeachersCount = signal<number>(0);

  getUsers() {
    return this.http.get<PaginationResult<UserList>>(this.apiUrl)
    .pipe(
      map((response) => {
        return response.results
      })
    )
  }

  getTeacherRequests() {
    return this.http.get<PaginationResult<TeacherValidation>>(`${this.apiUrl}pending_teachers/`)
    .pipe(
      map((response) => {
        return response.results
      })
    )
  }

  toggleUserStatus(userId: string) {
    return this.http.patch<UserList>(`${this.apiUrl}${userId}/toggle_status/`, {})
  }

  deleteUser(userId: string) {
    return this.http.delete<UserList>(`${this.apiUrl}${userId}/`)
  }

  approveTeacher(userId: string) {

    const body = {
      status: 'approved'
    }

    return this.http.patch<TeacherValidation>(`${this.apiUrl}${userId}/review_teacher/`, body)
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

  rejectTeacher(userId: string) {
    const body = {
      status: 'rejected'
    }

    return this.http.patch<TeacherValidation>(`${this.apiUrl}${userId}/review_teacher/`, body)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let error = 'Ocurrió un error inesperado al intentar rechazar la solicitud.';


        if (err.error && err.error.error) {
          error = err.error.error;
        }
        else if (err.status === 400 || err.status === 401) {
          // A veces DRF manda los errores en un arreglo, o bajo la llave "detail" o "non_field_errors"
          if (err.error.non_field_errors) {
            error = err.error.non_field_errors[0];
          } else {
            error = 'Ocurrió un error inesperado al intentar rechazar la solicitud.';
          }
        }
        return throwError(() => new Error(error));
      })
    )
  }

  updatePendingTeachersCount(newCount: number) {
    this.pendingTeachersCount.set(newCount);
  }

}
