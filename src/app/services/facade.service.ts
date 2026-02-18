import { inject, Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';
import{ CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

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

  // constructor(
  //   private http: HttpClient,
  //   public router: Router,
  //   private cookieService: CookieService,
  //   private validatorService: ValidatorService,
  //   private errorService: ErrorsService,
  // ) { }

  private http = inject(HttpClient);
  public router = inject(Router);
  private cookieService = inject(CookieService);
  private validatorService = inject(ValidatorService);


  //Funcion para validar login
  public validarLogin(username: String, password: String){
    let data = {
      "username": username,
      "password": password
    };

    console.log("Valindando login con datos: ", data);


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
    let headers: any;
    let token = this.getSessionToken();
    headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/logout/`, {headers: headers});
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
    var secure = environment.url_api.indexOf("https") !== -1;
    // Soporta respuesta plana o anidada en 'user'
    let id = user_data.id || user_data.user?.id;
    let email = user_data.email || user_data.user?.email;
    let first_name = user_data.first_name || user_data.user?.first_name || '';
    let last_name = user_data.last_name || user_data.user?.last_name || '';
    let name = (first_name + " " + last_name).trim();
    this.cookieService.set(user_id_cookie_name, id, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(user_email_cookie_name, email, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(user_complete_name_cookie_name, name, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(session_cookie_name, user_data.token, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(group_name_cookie_name, user_data.rol, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    console.log('cookies del usuario ',user_data)
  }

  destroyUser(){
    this.cookieService.deleteAll();
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
}
