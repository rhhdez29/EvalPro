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
        this.facadeService.saveUserData(response);

        const userRoles: string[] = response.roles;

        if (userRoles.includes('administrador')) {
          this.router.navigate(['home/admin/validation']);
        } else if (userRoles.includes('maestro')) {
          this.router.navigate(['home/teacher/subjects']);
        } else if (userRoles.includes('alumno')) {
          this.router.navigate(['home/student/classes']);
        } else {
          // Por si acaso
          this.router.navigate(['/home']);
        }
        this.isLoading = false;
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
