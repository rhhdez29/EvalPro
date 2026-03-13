import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ValidatorService } from '../../shared/utils/validator.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';
import{ CookieService } from 'ngx-cookie-service';
import { catchError, Observable, throwError } from 'rxjs';
import { group } from 'console';
import { UserLoginData } from '../../core/models/user.inteface';
import { isPlatformBrowser } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

//Estas son variables para las cookies
const session_cookie_name = 'evalpro-token';
const user_email_cookie_name = 'evalpro-email';
const user_id_cookie_name = 'evalpro-user_id';
const user_complete_name_cookie_name = 'evalpro-user_complete_name';
const group_name_cookie_name = 'evalpro-group_name';
const codigo_cookie_name = 'evalpro-codigo';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {

  private http = inject(HttpClient);
  public router = inject(Router);
  private cookieService = inject(CookieService);
  private validatorService = inject(ValidatorService);
  private platformId = inject(PLATFORM_ID);

  //nombres de las cookies
  private readonly TOKEN_COOKIE_NAME = 'evalpro-token';
  private readonly USER_DATA_COOKIE_NAME = 'evalpro-user_data';

  //Inicializamos la senal leyendo las cookies
  currentUser = signal<UserLoginData | null>(this.loadUserFromCookies());

  // Señales Computadas (Toda tu app consumirá estas variables reactivas)
  isAuthenticated = computed(() => this.currentUser() !== null);
  userName = computed(() => this.currentUser()?.first_name + ' ' + this.currentUser()?.last_name || 'Invitado');
  userRole = computed(() => this.currentUser()?.role || null);

  // Ejemplos de validaciones de rol rápidas:
  isTeacher = computed(() => this.currentUser()?.role === 'Teacher');
  isStudent = computed(() => this.currentUser()?.role === 'Student');

  //Funcion para validar login
  public validarLogin(username: string, password: string){
    let data = {
      "username": username,
      "password": password
    };

    return {
      username: this.validatorService.required(data.username) || this.validatorService.email(data.username),
      password: this.validatorService.required(data.password) || this.validatorService.minLength(data.password, 8)
    }


  }

  isValidForm(errors: any): boolean { // Verifica si el formulario es válido
      return Object.values(errors).every(error => !error);
  }

  //Iniciar sesión
  public login(username:String, password:String): Observable<any> {
    let data = {
      username: username,
      password: password
    }
    return this.http.post<any>(`${environment.url_api}/login/`,data);
  }

  //Cerrar sesión
  public logout(): Observable<any> {

    return this.http.get<any>(`${environment.url_api}/logout/`)
    .pipe(
          catchError (error => {
            console.log('Error fetching', error);
            return throwError( //utilizamos el operador catchError de RxJS para manejar los errores que puedan ocurrir durante la solicitud al API, en este caso estamos utilizando el método throwError de RxJS para lanzar un error personalizado, esto nos permite tener un mejor manejo de errores en nuestra aplicación y evitar que se muestren errores genéricos en la consola
              () => new Error('Usuario no registrado')
            )
          })
        );
  }


  saveUserData(userData: UserLoginData, token: string){
    if(isPlatformBrowser(this.platformId)){
      this.cookieService.set(this.TOKEN_COOKIE_NAME, token, 1, '/');

      this.cookieService.set(this.USER_DATA_COOKIE_NAME, JSON.stringify(userData), 1, '/');

    }

    this.currentUser.set(userData);
  }

  destroyUser(){
    if(isPlatformBrowser(this.platformId)){
      this.cookieService.deleteAll('/');
    }

    this.currentUser.set(null);
  }

  userToken(){
    return this.cookieService.get(this.TOKEN_COOKIE_NAME);
  }

  private loadUserFromCookies(): UserLoginData | null {
    if (isPlatformBrowser(this.platformId)) {
      const userData = this.cookieService.get(this.USER_DATA_COOKIE_NAME);
      if(userData){
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.log('Error al pasear los datos del usuario')
          return null;
        }
      }

    }
    return null;
  }

}
