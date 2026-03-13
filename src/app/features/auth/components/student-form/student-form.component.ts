  import { Component, computed, inject, signal } from '@angular/core';
  import { StudentService} from '../../services/student.service'

  import {
    LucideAngularModule,
    GraduationCap, Mail, Lock, User, ArrowRight,
    Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX, Eye, EyeOff
  } from 'lucide-angular';
  import { OnlyNumbersDirective } from '../../../../shared/directives/only-numbers.directive';
  import { OnlyLettersDirective } from '../../../../shared/directives/only-letters.directive';
  import { RouterLink, Router } from '@angular/router';
  import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
  import { CommonModule } from '@angular/common';

import { CAREERS, SEMESTERS } from '../../../../shared/constants/academic-data';
import { FormUtilsService } from '../../../../shared/utils/form-utils.service';
import { LoadingModalComponent } from '../../../../shared/components/loading-modal/loading-modal.component';

  @Component({
    selector: 'app-student-form',
    imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink, OnlyLettersDirective, OnlyNumbersDirective, ReactiveFormsModule, LoadingModalComponent],
    templateUrl: './student-form.component.html',
  })
  export class StudentFormComponent {

    studentService = inject(StudentService);
    route = inject(Router);
    private fb = inject(FormBuilder);
    formUtils = inject(FormUtilsService);

    // --- STATE (Signals) ---
    uploadedFile = signal<File | null>(null);
    isDragging = signal(false);
    modalStatus = signal<'oculto' | 'cargando' | 'exito' | 'error'>('oculto');
    messageModal1 = signal<string>('');
    messageModal2 = signal<string>('');
    showPassword = signal(false);

    touchedFields =signal<Set<string>>(new Set());

    // Cuando tenga datos, lanzará la petición.
    registerPayload = signal<FormData | null>(null);

    formStudent: FormGroup = this.fb.group({
      rol: ['alumno'],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, this.formUtils.strictEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      id_student: ['', [Validators.required, Validators.minLength(9)]],
      career: ['', [Validators.required]],
      semester: ['', [Validators.required]],
      kardex: [null, [Validators.required]]
    })

    // --- DATA ---
    listCareers = CAREERS;
    listSemesters = SEMESTERS;


    // --- ICONS ---
    readonly icons = {
      GraduationCap, Mail, Lock, User, ArrowRight,
      Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX, Eye, EyeOff
    };

    constructor() {}

    // --- METHODS ---


    togglePassword() {
      this.showPassword.update(v => !v);
    }


    // File Upload: Input Change
    onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0] ?? null

      if (file){

        this.formStudent.patchValue({ kardex: file });
        this.uploadedFile.set(file);
      }

    }

    // File Upload: Drag & Drop
    onDragOver(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging.set(true);
    }

    onDragLeave(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging.set(false);
    }

    onDrop(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging.set(false);

      if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        this.uploadedFile.set(event.dataTransfer.files[0]);
      }
    }

    removeFile() {
      this.formStudent.patchValue({ kardex: null });
      this.uploadedFile.set(null);
    }

    register() {

      if(this.formStudent.invalid){
        this.formStudent.markAllAsTouched();
        return;
      }
      const formData = new FormData();
      const rawData = this.formStudent.getRawValue();

      formData.append('rol', rawData.rol);
      formData.append('first_name', rawData.first_name);
      formData.append('last_name', rawData.last_name);
      formData.append('email', rawData.email);
      formData.append('password', rawData.password);
      formData.append('id_student', rawData.id_teacher);
      formData.append('career', rawData.career);
      formData.append('semester', rawData.semester);
      formData.append('kardex', this.uploadedFile()!, this.uploadedFile()!.name);

      this.modalStatus.set('cargando');
      this.messageModal1.set('Cargando');
      this.messageModal2.set('Estamos procesando tu solicitud...')

      this.studentService.registerStudent(formData).subscribe({
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
            this.formStudent.reset();
            this.uploadedFile.set(null);
          }, 3000);



        }
      })

    }
  }

