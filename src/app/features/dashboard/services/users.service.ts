import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserList } from '../models/UserList.interface';
import { PaginationResult } from '../models/PaginationResult';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  http = inject(HttpClient)

  apiUrl = 'http://127.0.0.1:8000/users/'

  getUsers() {
    return this.http.get<PaginationResult<UserList>>(this.apiUrl)
    .pipe(
      map((response) => response.results)
    )
  }

}
