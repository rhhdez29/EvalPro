import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from './../../../../environments/environments';
import { map, Observable } from 'rxjs';
import { RESTSubject } from '../models/RESTSubjectResponse.interface';
import { Subject, } from '../models/subject.interface';
// import { SubjectMapper } from '../../../shared/mappers/subject-mapper';
import { ValidatorService } from '../../../shared/utils/validator.service';
import { PaginationResult } from '../models/PaginationResult';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  http = inject(HttpClient);
  validator = inject(ValidatorService);
  apiUrl = `${environment.url_api}/subjects/`;


  // Obtener todas las materias
  getSubjects (): Observable<Subject[]> {
    return this.http.get<PaginationResult<RESTSubject>>(this.apiUrl)
    .pipe(
      map((response) => response.results)
    );
  }

  // Crear una nueva materia
  createSubject(subjectData: any) {
    return this.http.post<any>(this.apiUrl, subjectData);
  }

  // Obtener una materia por su ID
  getSubjectById(id: string) {
    return this.http.get<Subject>(`${this.apiUrl}${id}/`);
  }
}
