  import { Component, computed, inject, signal } from '@angular/core';
  import { AlumnoService } from '../../../../../services/student.service';
  import { StudentData } from '../../../../../shared/interfaces/student.interface';

  import {
    LucideAngularModule,
    GraduationCap, Mail, Lock, User, ArrowRight,
    Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX
  } from 'lucide-angular';
  import { OnlyNumbersDirective } from '../../../../../shared/directives/only-numbers.directive';
  import { OnlyLettersDirective } from '../../../../../shared/directives/only-letters.directive';
  import { RouterLink, Router } from '@angular/router';
  import { FormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';

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

    touchedFields =signal<Set<string>>(new Set());



    alumno =signal<StudentData>({
      rol: 'alumno',
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      matricula: '',
      carrera: '',
      semestre: '',
      kardex: null
    })

    // --- DATA ---
    readonly semesters = Array.from({length: 10}, (_, i) => i + 1); // [1, 2, ... 12]
    carreras = [
      'Ingeniería en Sistemas Computacionales',
      'Ingeniería Industrial',
      'Ingeniería Mecánica',
      'Ingeniería Eléctrica',
      'Ingeniería Civil'];

    facultades = [
      'Ciencias de la Computación',
      'Ingeniería Industrial',
      'Ingeniería Mecánica',
      'Ingeniería Eléctrica',
      'Ingeniería Civil'
    ];

    // --- ICONS ---
    readonly icons = {
      GraduationCap, Mail, Lock, User, ArrowRight,
      Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX
    };

    constructor() {}

    // --- METHODS ---

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
      this.alumno.update(a => ({ ...a, [field]: value }));

    }

    // File Upload: Input Change
    onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0] ?? null

      this.alumno.update(a => ({...a, kardex: file}));

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
      const data = this.alumno();
      return this.studentService.validateStudent(data);
    })

    isFormValid = computed(() => {
        return this.studentService.isValidForm(this.StudentErrors());
    });

    onSubmit() {
      console.log('Formulario válido:', this.isFormValid());
      if (this.isFormValid()) {
        this.route.navigate(['/home/dashboard'])
      }

    }
  }

