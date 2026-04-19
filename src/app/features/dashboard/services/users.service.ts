import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserList } from '../models/UserList.interface';
import { PaginationResult } from '../models/PaginationResult';
import { map } from 'rxjs';
import { TeacherValidation } from '../../../core/models/user.inteface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  http = inject(HttpClient)

  apiUrl = 'http://127.0.0.1:8000/users/'

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

    return this.http.patch<TeacherValidation>(`${this.apiUrl}${userId}/review_teacher/`, body);
  }

  rejectTeacher(userId: string) {
    const body = {
      status: 'rejected'
    }

    return this.http.patch<TeacherValidation>(`${this.apiUrl}${userId}/review_teacher/`, body);
  }

}
