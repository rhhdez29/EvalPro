import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  LucideAngularModule,
  GraduationCap, Mail, Lock, User, ArrowRight,
  Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX, Eye, EyeOff
} from 'lucide-angular';
import { FacadeService } from '../../../services/facade.service';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';
import { UserSesion } from '../../../shared/interfaces/user.inteface';

@Component({
  selector: 'app-auth-login',
  imports: [LucideAngularModule, FormsModule,CommonModule,RouterLink],
  templateUrl: './auth-login.component.html',
})
export class AuthLoginComponent {

  private facadeService = inject(FacadeService);
  private http = inject(HttpClient);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  // --- ICONS ---
  readonly icons = {
    GraduationCap, Mail, Lock, User, ArrowRight,
    Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX, Eye, EyeOff
  };

  user = signal({
    username: '',
    password: ''
  })

  touchedFields =signal<Set<string>>(new Set());
  showPassword = signal(false);

  constructor() { }

  setData(field: string, value: string) { // Actualizar datos
    this.user.update(a => ({ ...a, [field]: value }));
  }

  userErrors = computed(() => {
    const data = this.user();

    console.log(data);

    return this.facadeService.validarLogin(data.username, data.password);

  });

  markAsTouched(field: string) { // Marcar campo como "tocado" para mostrar errores solo después de la interacción
    this.touchedFields.update(set =>
    {
      const newSet = new Set(set);
      newSet.add(field);
      return newSet;
    });
  }

  shouldShowError(field: string): boolean {
    const errors = this.userErrors(); // Obtener errores actuales
    const touched = this.touchedFields(); // Obtener campos tocados

    // @ts-ignore (Si usas tipado estricto, indexar por string requiere cuidado)
    return !!errors[field] && touched.has(field);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  isValidForm = computed(() => {

    return this.facadeService.isValidForm(this.userErrors());

  })

  login() {
    // Aquí iría la lógica para enviar los datos al backend
    console.log('Formulario enviado', this.user());

    this.facadeService.login(this.user().username, this.user().password).subscribe({
      next: (response) => {

        let userData: UserSesion;

        console.log(response);

        if(response.roles[0]==='maestro'){
          console.log('soy maestro')
          userData = {
            id: response.id,
            email: response.email,
            firtsName: response.first_name,
            lastName: response.last_name,
            role: response.roles[0],
            id_teacher: response.id_teacher,
            faculty: response.faculty
          }

        }else{
          userData = {
            id: response.id,
            email: response.email,
            firtsName: response.first_name,
            lastName: response.last_name,
            role: response.roles[0],
            id_student: response.id_student,
            career: response.career,
            semester: response.semester,
            kardex: response.kardex
          }
        }

        console.log(userData);

        this.facadeService.saveUserData(userData, response.token);

        if(response.roles[0]==='administrador'){
          this.router.navigate(['home/admin/validation']);
        }else if(response.roles[0]==='maestro'){
          this.router.navigate(['home/teacher/subjects']);
        }else{
          this.router.navigate(['home/student/classes']);
        }

      },
      error: (err) => {
        // Manejo de errores (credenciales incorrectas)
        this.isLoading = false;
        if (err.status === 400 || err.status === 403 || err.status === 404) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else {
          this.errorMessage = 'Error de conexión con el servidor.';
        }
        console.error('Error de login:', err);
      }
    })


  }

}
