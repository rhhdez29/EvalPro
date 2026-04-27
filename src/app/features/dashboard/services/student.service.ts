import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { Subject } from '../models/subject.interface';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { PaginationResult } from '../models/PaginationResult';
import { RESTSubject } from '../models/RESTSubjectResponse.interface';

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


}
