import { inject, Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { StudentData, StudentErrors } from '../shared/interfaces/student.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environments';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  constructor() { }

  private validator = inject(ValidatorService);
  private http = inject(HttpClient);

  validateStudent(data: StudentData, kardex: File): StudentErrors {

    console.log('Validando datos alumno...', data);

    //validaciones
    return {
      first_name: this.validator.required(data.first_name),
      last_name: this.validator.required(data.last_name),
      email: this.validator.email(data.email) || this.validator.required(data.email),
      password: this.validator.minLength(data.password, 8) || this.validator.required(data.password),
      id_student: this.validator.required(data.id_student) || this.validator.justLength(data.id_student, 9),
      career: null, // La career es opcional, no necesita validación adicional
      semester: null, // El semester es un opcional, no necesita validación adicional
      kardex: this.validator.requiredFile(kardex)
    };

  }

  isValidForm(errors: StudentErrors): boolean { // Verifica si el formulario es válido
    return Object.values(errors).every(error => !error);
  }

  public registerStudent(data: FormData): Observable<any>{
    console.log("Datos del usuario registrado: ", data)

    return this.http.post<any>(`${environment.url_api}/students/`, data)
      .pipe(
        catchError (error => {
          console.log('Error fetching', error);

          return throwError( //utilizamos el operador catchError de RxJS para manejar los errores que puedan ocurrir durante la solicitud al API, en este caso estamos utilizando el método throwError de RxJS para lanzar un error personalizado, esto nos permite tener un mejor manejo de errores en nuestra aplicación y evitar que se muestren errores genéricos en la consola
            () => new Error('No se pudo registrar al alumno')
          )
        })
      );
  }

}
