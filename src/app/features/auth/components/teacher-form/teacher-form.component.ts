import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  GraduationCap, Mail, Lock, User, ArrowRight,
  Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX,Eye, EyeOff
} from 'lucide-angular';
import { OnlyLettersDirective } from '../../../../shared/directives/only-letters.directive';
import { OnlyNumbersDirective } from '../../../../shared/directives/only-numbers.directive';
import { TeacherRegister } from '../../models/teacher.inteface';
import { MaestroService } from '../../services/teacher.service';
import { FACULTIES } from '../../../../shared/constants/academic-data';
import { FormUtilsService } from '../../../../shared/utils/form-utils.service';
import { LoadingModalComponent } from '../../../../shared/components/loading-modal/loading-modal.component';


@Component({
  selector: 'app-teacher-form',
  imports: [CommonModule,
            FormsModule,
            LucideAngularModule,
            RouterLink,
            OnlyLettersDirective,
            OnlyNumbersDirective,
            ReactiveFormsModule,
            LoadingModalComponent
          ],
  templateUrl: './teacher-form.component.html',
})
export class TeacherFormComponent {

  teacherService = inject(MaestroService);
  route = inject(Router)
  private fb = inject(FormBuilder);
  formUtils = inject(FormUtilsService);

  // --- STATE (Signals) ---
  uploadedFile = signal<File | null>(null);
  isDragging = signal(false);
  showPassword = signal(false);
  modalStatus = signal<'oculto' | 'cargando' | 'exito' | 'error'>('oculto');
  messageModal1 = signal<string>('');
  messageModal2 = signal<string>('');

  // --- DATA --

  listFaculties = FACULTIES;

  formTeacher = this.fb.group({
    rol: ['maestro'],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, this.formUtils.strictEmailValidator()]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    id_teacher: ['', [Validators.required, Validators.minLength(9)]],
    faculty: ['', Validators.required]
  })


  // --- ICONS ---
  readonly icons = {
    GraduationCap, Mail, Lock, User, ArrowRight,
    Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX,Eye, EyeOff
  };

  constructor() {}

  // --- METHODS ---

  togglePassword() {
      this.showPassword.update(v => !v);
    }


  register() {

    console.log('datos Formulario: ', this.formTeacher.getRawValue())

    if(this.formTeacher.invalid){
      this.formTeacher.markAllAsTouched();
      return;
    }

    const rawData = this.formTeacher.getRawValue();
    let teacherData: TeacherRegister;

    teacherData = {
      role: rawData.rol!,
      first_name: rawData.first_name!,
      last_name: rawData.last_name!,
      email: rawData.email!,
      password: rawData.password!,
      id_teacher: rawData.id_teacher!,
      faculty: rawData.faculty!
    }

    this.modalStatus.set('cargando');
    this.messageModal1.set('Cargando');
    this.messageModal2.set('Estamos procesando tu solicitud...')

    this.teacherService.registerTeacher(teacherData).subscribe({
      next: (response) => {
        this.modalStatus.set('exito');
        this.messageModal1.set('¡Registro exitoso!');
        this.messageModal2.set('Ya puedes iniciar sesion')


        setTimeout(() => {
          this.modalStatus.set('oculto');
          this.route.navigate(['/landing']);
        }, 3000);

      },
      error: (err) => {

        this.modalStatus.set('error');
        const mensajeError = err.error?.detail || 'Hubo un error al registrar tu cuenta'

        this.messageModal1.set('Uy, algo salió mal...');
        this.messageModal2.set(mensajeError);

        setTimeout(() => {
          this.modalStatus.set('oculto');
          this.formTeacher.reset();
        }, 3000);



      }
    })

  }
}
