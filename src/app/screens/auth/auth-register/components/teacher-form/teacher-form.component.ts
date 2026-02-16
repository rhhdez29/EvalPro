import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  GraduationCap, Mail, Lock, User, ArrowRight,
  Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX,Eye, EyeOff
} from 'lucide-angular';
import { OnlyLettersDirective } from '../../../../../shared/directives/only-letters.directive';
import { OnlyNumbersDirective } from '../../../../../shared/directives/only-numbers.directive';
import { TeacherData } from '../../../../../shared/interfaces/teacher.inteface';
import { MaestroService } from '../../../../../services/teacher.service';

@Component({
  selector: 'app-teacher-form',
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink, OnlyLettersDirective, OnlyNumbersDirective, ],
  templateUrl: './teacher-form.component.html',
})
export class TeacherFormComponent {

  teacherService = inject(MaestroService);
  route = inject(Router)

  // --- STATE (Signals) ---
  uploadedFile = signal<File | null>(null);
  isDragging = signal(false);
  rolActivo = signal<'alumno' | 'maestro'>('alumno');
  showPassword = signal(false);

  touchedFields =signal<Set<string>>(new Set());



  maestro = signal<TeacherData>({
    rol: 'maestro',
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    numeroEmpleado: '',
    Facultad: ''
  })


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
    Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX,Eye, EyeOff
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
      const errors = this.TeacherErrors(); // Obtener errores actuales
      const touched = this.touchedFields(); // Obtener campos tocados

      // @ts-ignore (Si usas tipado estricto, indexar por string requiere cuidado)
      return !!errors[field] && touched.has(field);
    }

  setData(field: string, value: string) { // Actualizar datos

    this.maestro.update(m => ({ ...m, [field]: value }));

  }



  TeacherErrors = computed(() => {
    const data = this.maestro();
    return this.teacherService.validateTeacher(data);
  })

  isFormValid = computed(() => {
    return this.teacherService.isValidForm(this.TeacherErrors());
  });

  onSubmit() {
    console.log('Formulario enviado con datos:', this.maestro());
    console.log('Formulario válido:', this.isFormValid());
    if (this.isFormValid()) {
      this.route.navigate(['/home/dashboard']);
    }

  }

}
