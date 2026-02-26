import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from './../../environments/environments';
import { map, Observable } from 'rxjs';
import { RESTSubject } from '../shared/interfaces/RestSubject.interface';
import { CreateSubjectForm, Subject, SubjectErrors } from '../shared/interfaces/subject.interface';
import { SubjectMapper } from '../shared/mappers/subject-mapper';
import { ValidatorService } from './tools/validator.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  http = inject(HttpClient);
  validator = inject(ValidatorService);
  apiUrl = `${environment.url_api}/subjects/`;

  //Validacion de formulario
  validateSubject(data: CreateSubjectForm){

    return{
      name: this.validator.required(data.name),
      code: this.validator.required(data.code),
      department: this.validator.required(data.department),
      color: this.validator.required(data.color)
    }

  }

  isValidForm(errors: SubjectErrors): boolean { // Verifica si el formulario es válido
    return Object.values(errors).every(error => !error);
  }

  // Obtener todas las materias
  getSubjects (): Observable<Subject[]> {
    return this.http.get<RESTSubject>(this.apiUrl)
    .pipe(
      map((response) => SubjectMapper.mapRestSubjectsItemsToSubjectsArray(response))
    );
  }

  // Crear una nueva materia
  createSubject(subjectData: any) {
    return this.http.post<any>(this.apiUrl, subjectData);
  }
}
