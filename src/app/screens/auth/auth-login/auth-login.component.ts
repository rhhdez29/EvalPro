import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  GraduationCap, Mail, Lock, User, ArrowRight,
  Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX,
  Form
} from 'lucide-angular';

@Component({
  selector: 'app-auth-login',
  imports: [LucideAngularModule, FormsModule,CommonModule,RouterLink],
  templateUrl: './auth-login.component.html',
})
export class AuthLoginComponent {

  // --- ICONS ---
  readonly icons = {
    GraduationCap, Mail, Lock, User, ArrowRight,
    Upload, CheckCircle, BookOpen, Briefcase, Hash, CircleX
  };

  onSubmit() {
    // Aquí iría la lógica para enviar los datos al backend
    console.log('Formulario enviado');
  }

}
