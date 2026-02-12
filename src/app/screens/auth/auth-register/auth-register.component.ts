import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  GraduationCap, Mail, Lock, User, ArrowRight,
  Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX
} from 'lucide-angular';
import { StudentData, StudentErrors } from '../../../shared/interfaces/student.interface';
import { TeacherData, TeacherErrors } from '../../../shared/interfaces/teacher.inteface';
import { sign } from 'crypto';
import { AlumnoService } from '../../../services/student.service';
import { OnlyLettersDirective } from '../../../shared/directives/only-letters.directive';
import { OnlyNumbersDirective } from '../../../shared/directives/only-numbers.directive';
import { MaestroService } from '../../../services/teacher.service';

@Component({
  selector: 'auth-register',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink, OnlyLettersDirective, OnlyNumbersDirective],
  templateUrl: './auth-register.component.html',
})
export class AuthRegisterComponent {

  studentService = inject(AlumnoService);
  teacherService = inject(MaestroService);

  // --- STATE (Signals) ---
  uploadedFile = signal<File | null>(null);
  isDragging = signal(false);
  rolActivo = signal<'alumno' | 'maestro'>('alumno');

  formData = computed(() => this.rolActivo() === 'alumno' ? this.alumno() : this.maestro());

  touchedFields =signal<Set<string>>(new Set());



  alumno =signal<StudentData>({
    rol: 'alumno' as 'alumno' | 'maestro',
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    matricula: '',
    carrera: '',
    semestre: '',
    kardex: null
  })

  maestro = signal<TeacherData>({
    rol: 'maestro' as 'alumno' | 'maestro',
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    numeroEmpleado: '',
    Facultad: ''
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

  constructor(private router: Router) {}

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

    if(this.rolActivo() === 'alumno') {
      return this.touchedFields().has(field) && !!this.StudentErrors()[field as keyof StudentErrors];
    } else {
      return this.touchedFields().has(field) && !!this.TeacherErrors()[field as keyof TeacherErrors];
    }
  }

  setRole(Rol: 'alumno' | 'maestro') {
    this.rolActivo.set(Rol);

    if (Rol === 'alumno') {
      this.alumno.update(a => ({ ...a, rol: 'alumno' }));
      this.maestro.update(m => ({ ...m, nombre: '', apellido: '', correo: '', password: '', NumeroEmpleado: '', Facultad: '' })); // Limpiar datos del maestro al cambiar de rol
      this.uploadedFile.set(null); // Limpiar archivo si cambia de rol
    } else {
      this.alumno.update(a => ({ ...a, nombre: '', apellido: '', password: '', correo: '',  matricula: '', carrera: '', semestre: '', kardex: null })); // Limpiar datos del alumno al cambiar de rol
      this.uploadedFile.set(null); // Limpiar archivo si cambia de rol
      this.maestro.update(m => ({ ...m, rol: 'maestro' }));
    }
  }

  setData(field: string, value: string) { // Actualizar datos
    console.log('Rol seleccionado:', this.rolActivo());
    if (this.rolActivo() === 'alumno') {
      this.alumno.update(a => ({ ...a, [field]: value }));
    }else {
      this.maestro.update(m => ({ ...m, [field]: value }));
    }
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

  TeacherErrors = computed(() => {
    const data = this.maestro();
    return this.teacherService.validateTeacher(data);
  })

  isFormValid = computed(() => {

    if (this.rolActivo() === 'alumno') {
      return this.studentService.isValidForm(this.StudentErrors());
    } else {
      return this.teacherService.isValidForm(this.TeacherErrors());
    }
  });

  onSubmit() {
    console.log('Formulario enviado con datos:', this.alumno(), this.maestro());
    console.log('Formulario válido:', this.isFormValid());
    if (this.isFormValid()) {
      this.router.navigate(['/home/dashboard']);
    }

  }
}
