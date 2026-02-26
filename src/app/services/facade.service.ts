import { inject, Injectable, signal } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';
import{ CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { group } from 'console';

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


  currentUser = signal<any>(this.getUserDataFromCookie());

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

    return this.http.get<any>(`${environment.url_api}/logout/`);
  }

  // Funciones para utilizar las cookies en web
  retrieveSignedUser(){
    var headers: any;
    var token = this.getSessionToken();
    headers = new HttpHeaders({'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/me/`,{headers:headers});
  }

  getCookieValue(key:string){
    return this.cookieService.get(key);
  }

  saveCookieValue(key:string, value:string){
    var secure = environment.url_api.indexOf("https")!=-1;
    this.cookieService.set(key, value, undefined, undefined, undefined, secure, secure?"None":"Lax");
  }

  saveUserData(user_data: any) {
    console.log('cokies al iniciar sesion: ', user_data);
    var secure = environment.url_api.indexOf("https") !== -1;

    // 1. Extraemos los datos de forma segura
    let id = user_data.id || user_data.user?.id || '';
    let first_name = user_data.first_name || user_data.user?.first_name || '';
    let last_name = user_data.last_name || user_data.user?.last_name || '';
    let email = user_data.email || user_data.user?.email || '';
    let name = (first_name + " " + last_name).trim();

    // 2. Extraemos el ROL como un texto simple (por si viene como arreglo ['maestro'])
    let userRole = Array.isArray(user_data.roles) ? user_data.roles[0] : (user_data.roles || '');

    // 3. Guardamos forzando TODO a String() para evitar valores mutados o "undefined"
    this.cookieService.set(user_id_cookie_name, String(id), 1, '/');
    this.cookieService.set(user_email_cookie_name, String(email), 1, '/');
    this.cookieService.set(user_complete_name_cookie_name, String(name), 1, '/');
    this.cookieService.set(session_cookie_name, String(user_data.token || ''), 1, '/');
    this.cookieService.set(group_name_cookie_name, String(userRole), 1, '/');

    console.log('Cookies guardadas:', this.cookieService.get(session_cookie_name));

    // 4. Actualizamos la señal con los datos recién salidos de la cookie
    this.currentUser.set({
      id: id,
      email: email,
      nameComplete: this.cookieService.get(user_complete_name_cookie_name),
      name: first_name,
      lastName: last_name,
      group: userRole
    });
}

  destroyUser(){
    var secure = environment.url_api.indexOf("https") !== -1;

    this.cookieService.delete(user_id_cookie_name, '/', undefined, secure, secure ? "None" : "Lax");
    this.cookieService.delete(user_email_cookie_name, '/', undefined, secure, secure ? "None" : "Lax");
    this.cookieService.delete(user_complete_name_cookie_name, '/', undefined, secure, secure ? "None" : "Lax");
    this.cookieService.delete(session_cookie_name, '/', undefined, secure, secure ? "None" : "Lax");
    this.cookieService.delete(group_name_cookie_name, '/', undefined, secure, secure ? "None" : "Lax");

    console.trace('🚨 ¡ALERTA! Alguien ejecutó destroyUser() y borró las cookies');
  }

  getUserDataFromCookie(){
    return {
      id: this.getUserId(),
      email: this.getUserEmail(),
      name: this.getUserCompleteName(),
      group: this.getUserGroup()
    }
  }

  getSessionToken(){
    return this.cookieService.get(session_cookie_name);
  }

  getUserEmail(){
    return this.cookieService.get(user_email_cookie_name);
  }

  getUserCompleteName(){
    return this.cookieService.get(user_complete_name_cookie_name);
  }

  getUserId(){
    return this.cookieService.get(user_id_cookie_name);
  }

  getUserGroup(){
    return this.cookieService.get(group_name_cookie_name);
  }

  isValidForm(errors: any): boolean { // Verifica si el formulario es válido
      return Object.values(errors).every(error => !error);
  }

}
