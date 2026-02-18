import { inject, Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { TeacherData, TeacherErrors } from '../shared/interfaces/teacher.inteface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environments';
import { error } from 'console';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MaestroService {

  validator = inject(ValidatorService);
  http = inject(HttpClient);


  validateTeacher(data: TeacherData): TeacherErrors {

      console.log('Validando datos maestro...', data);

      //validaciones
      return {
        first_name: this.validator.required(data.first_name),
        last_name: this.validator.required(data.last_name),
        email: this.validator.email(data.email) || this.validator.required(data.email),
        password: this.validator.minLength(data.password, 8) || this.validator.required(data.password),
        id_teacher: this.validator.required(data.id_teacher) || this.validator.justLength(data.id_teacher, 9),
        faculty: this.validator.required(data.faculty)
      };

    }

    isValidForm(errors: TeacherErrors): boolean { // Verifica si el formulario es válido
      return Object.values(errors).every(error => !error);
    }

    public registerTeacher(data: TeacherData): Observable<any>{
      console.log("Datos del usuario registrado: ", data)

      return this.http.post<any>(`${environment.url_api}/teachers/`, data, httpOptions)
        .pipe(
          catchError (error => {
            console.log('Error fetching', error);

            return throwError( //utilizamos el operador catchError de RxJS para manejar los errores que puedan ocurrir durante la solicitud al API, en este caso estamos utilizando el método throwError de RxJS para lanzar un error personalizado, esto nos permite tener un mejor manejo de errores en nuestra aplicación y evitar que se muestren errores genéricos en la consola
              () => new Error('No se pudo registrar al masestro')
            )
          })
        );

    }
}
