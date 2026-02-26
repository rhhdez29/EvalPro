  import { Component, computed, inject, signal } from '@angular/core';
  import { AlumnoService } from '../../../../../services/student.service';
  import { StudentData } from '../../../../../shared/interfaces/student.interface';

  import {
    LucideAngularModule,
    GraduationCap, Mail, Lock, User, ArrowRight,
    Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX, Eye, EyeOff
  } from 'lucide-angular';
  import { OnlyNumbersDirective } from '../../../../../shared/directives/only-numbers.directive';
  import { OnlyLettersDirective } from '../../../../../shared/directives/only-letters.directive';
  import { RouterLink, Router } from '@angular/router';
  import { FormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

  @Component({
    selector: 'app-student-form',
    imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink, OnlyLettersDirective, OnlyNumbersDirective],
    templateUrl: './student-form.component.html',
  })
  export class StudentFormComponent {

    studentService = inject(AlumnoService);
    route = inject(Router)

    // --- STATE (Signals) ---
    uploadedFile = signal<File | null>(null);
    isDragging = signal(false);
    rolActivo = signal<'alumno' | 'maestro'>('alumno');
    showPassword = signal(false);

    touchedFields =signal<Set<string>>(new Set());

    // Cuando tenga datos, lanzará la petición.
    registerPayload = signal<FormData | null>(null);

    student =signal<StudentData>({
      rol: 'alumno',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      id_student: '',
      career: '',
      semester: '',
      kardex: ''
    })

    // --- DATA ---
    readonly semesters = Array.from({length: 10}, (_, i) => i + 1); // [1, 2, ... 12]
    careers = [
      'Ingeniería en Sistemas Computacionales',
      'Ingeniería Industrial',
      'Ingeniería Mecánica',
      'Ingeniería Eléctrica',
      'Ingeniería Civil'];

    facultyes = [
      'Ciencias de la Computación',
      'Ingeniería Industrial',
      'Ingeniería Mecánica',
      'Ingeniería Eléctrica',
      'Ingeniería Civil'
    ];

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

    markAsTouched(field: string) { // Marcar campo como "tocado" para mostrar errores solo después de la interacción
      this.touchedFields.update(set =>
      {
        const newSet = new Set(set);
        newSet.add(field);
        return newSet;
      });
    }

    shouldShowError(field: string): boolean {
      const errors = this.StudentErrors(); // Obtener errores actuales
      const touched = this.touchedFields(); // Obtener campos tocados

      // @ts-ignore (Si usas tipado estricto, indexar por string requiere cuidado)
      return !!errors[field] && touched.has(field);
    }

    setData(field: string, value: string) { // Actualizar datos
      this.student.update(a => ({ ...a, [field]: value }));

    }

    // File Upload: Input Change
    onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0] ?? null

      if (file){
        this.student.update(a => ({...a, kardex: file!.name}));
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
      this.uploadedFile.set(null);
    }

    StudentErrors = computed(() => {
      const data = this.student();
      return this.studentService.validateStudent(data, this.uploadedFile()!);
    })

    isFormValid = computed(() => {
        return this.studentService.isValidForm(this.StudentErrors());
    });

    registerResource = rxResource({
    params: () => this.registerPayload(),
    stream: ({ params }) => {
      // Si el payload es null (estado inicial), no disparamos la petición
      if (!params) return of(null);

      // Si hay datos, hacemos el POST al backend de Django
      return this.studentService.registerStudent(params);
    }
  });

    register() {

      const formData = new FormData();

      formData.append('rol', this.student().rol);
      formData.append('first_name', this.student().first_name);
      formData.append('last_name', this.student().last_name);
      formData.append('email', this.student().email);
      formData.append('password', this.student().password);
      formData.append('id_student', this.student().id_student);
      formData.append('career', this.student().career);
      formData.append('semester', this.student().semester);

      formData.append('kardex', this.uploadedFile()!, this.uploadedFile()!.name);

      this.registerPayload.set(formData);

      this.route.navigate(['/landing']);

    }
  }

