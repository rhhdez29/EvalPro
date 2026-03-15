import { inject, Injectable } from '@angular/core';
import { TeacherRegister } from '../models/teacher.inteface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { error } from 'console';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MaestroService {

  http = inject(HttpClient);


    public registerTeacher(data: TeacherRegister): Observable<any>{
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
