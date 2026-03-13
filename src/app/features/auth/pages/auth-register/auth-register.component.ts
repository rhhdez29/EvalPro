import { Component, computed, inject, signal } from '@angular/core';
import {
  LucideAngularModule,
  GraduationCap, Mail, Lock, User, ArrowRight,
  Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX
} from 'lucide-angular';
import { StudentFormComponent } from '../../components/student-form/student-form.component';
import { TeacherFormComponent } from '../../components/teacher-form/teacher-form.component';

@Component({
  selector: 'auth-register',
  standalone: true,
  imports: [LucideAngularModule, StudentFormComponent, TeacherFormComponent],
  templateUrl: './auth-register.component.html',
})
export class AuthRegisterComponent {
  // --- ICONS ---
  readonly icons = {
    GraduationCap, Mail, Lock, User, ArrowRight,
    Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX
  };

  rolActivo = signal<'alumno' | 'maestro'>('alumno');

  setRole(Rol: 'alumno' | 'maestro') {
    this.rolActivo.set(Rol);
  }

}

