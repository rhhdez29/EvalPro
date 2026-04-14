import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  LucideAngularModule,
  GraduationCap, Mail, Lock, User, ArrowRight,
  Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX, Eye, EyeOff
} from 'lucide-angular';
import { FacadeService } from '../../../../core/services/facade.service';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';
import { UserLoginData } from '../../../../core/models/user.inteface';
import { FormUtilsService } from '../../../../shared/utils/form-utils.service';
import { LoadingModalComponent } from '../../../../shared/components/loading-modal/loading-modal.component';

@Component({
  selector: 'app-auth-login',
  imports: [LucideAngularModule, FormsModule,CommonModule,RouterLink, ReactiveFormsModule, LoadingModalComponent],
  templateUrl: './auth-login.component.html',
})
export class AuthLoginComponent {

  private facadeService = inject(FacadeService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  formUtils = inject(FormUtilsService);

  modalStatus = signal<'oculto' | 'cargando' | 'exito' | 'error'>('oculto');
  messageModal1 = signal<string>('');
  messageModal2 = signal<string>('');

  // --- ICONS ---
  readonly icons = {
    GraduationCap, Mail, Lock, User, ArrowRight,
    Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX, Eye, EyeOff
  };

  formUser: FormGroup = this.fb.group({
    username: ['', [Validators.required, this.formUtils.strictEmailValidator()]],
    password: ['', [Validators.required]]
  })

  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  login() {

    if(this.formUser.invalid){
      this.formUser.markAllAsTouched();
      return;
    }

    const userData = this.formUser.getRawValue();

    this.modalStatus.set('cargando');
    this.messageModal1.set('Cargando');
    this.messageModal2.set('Estamos procesando tu solicitud...')

    this.facadeService.login(userData.username, userData.password).subscribe({
      next: (response) => {

        this.modalStatus.set('exito');
        this.messageModal1.set('¡Inicio de sesion exitoso!');
        this.messageModal2.set('Espere un momento...')

        let userData: UserLoginData;

        console.log(response);

        if(response.roles[0]==='maestro'){
          console.log('soy maestro')
          userData = {
            id: response.id,
            email: response.email,
            first_name: response.first_name,
            last_name: response.last_name,
            role: response.roles[0],
            id_teacher: response.id_teacher,
            faculty: response.faculty
          }

        }else{
          userData = {
            id: response.id,
            email: response.email,
            first_name: response.first_name,
            last_name: response.last_name,
            role: response.roles[0],
            id_student: response.id_student,
            career: response.career,
            semester: response.semester,
            kardex: response.kardex
          }
        }

        console.log(userData);

        this.facadeService.saveUserData(userData, response.token);

        setTimeout(() => {
          this.modalStatus.set('oculto');
          if(response.roles[0]==='administrador'){
            this.router.navigate(['home/admin/validation']);
          }else if(response.roles[0]==='maestro'){
            this.router.navigate(['home/teacher/subjects']);
          }else{
            this.router.navigate(['home/student/classes']);
          }
        }, 3000);

      },
      error: (error: string) => {

        this.modalStatus.set('error');
        this.messageModal1.set('Uy, algo salió mal...');
        this.messageModal2.set(error);

        setTimeout(() => {
          this.modalStatus.set('oculto');
          this.formUser.reset();
        }, 3000);

      }
    })


  }

}
