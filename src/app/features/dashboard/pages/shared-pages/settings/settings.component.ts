import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  User,
  Mail,
  Shield,
  Building,
  GraduationCap,
  Lock,
  Key,
  Eye,
  EyeOff,
  Save,
  Moon,
  Globe,
  CheckCircle,
  IdCard
} from 'lucide-angular';

import { FacadeService } from '../../../../../core/services/facade.service';
import { FormUtilsService } from '../../../../../shared/utils/form-utils.service';
import { LoadingModalComponent } from '../../../../../shared/components/loading-modal/loading-modal.component';
import { ThemeService } from '../../../../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
    LoadingModalComponent
  ],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  private facadeService = inject(FacadeService);
  private themeService = inject(ThemeService);
  private fb = inject(FormBuilder);
  public formUtils = inject(FormUtilsService);

  // Iconos
  readonly icons = {
    User,
    Mail,
    Shield,
    Building,
    GraduationCap,
    Lock,
    Key,
    Eye,
    EyeOff,
    Save,
    Moon,
    Globe,
    CheckCircle,
    IdCard
  };

  // Datos del Usuario
  currentUser = this.facadeService.currentUser;
  userRole = this.facadeService.userRole;

  fullName = computed(() => {
    const user = this.currentUser();
    if (!user) return 'Usuario';
    const first = user.first_name || '';
    const last = user.last_name || '';
    return `${first} ${last}`.trim() || 'Usuario';
  });

  roleLabel = computed(() => {
    const role = this.userRole();
    if (role === 'maestro') return 'Profesor';
    if (role === 'alumno') return 'Estudiante';
    if (role === 'administrador') return 'Administrador';
    return role || 'Usuario';
  });

  userIdentifier = computed(() => {
    const user = this.currentUser() as any;
    if (!user) return 'N/A';
    return user.id_teacher || user.id_student || (user.id ? String(user.id) : 'N/A');
  });

  identifierLabel = computed(() => {
    const role = this.userRole();
    if (role === 'maestro') return 'Número de Empleado';
    if (role === 'alumno') return 'Matrícula';
    return 'ID de Usuario';
  });

  academicInfo = computed(() => {
    const user = this.currentUser() as any;
    if (!user) return null;
    if (user.faculty) {
      return { label: 'Facultad', value: user.faculty };
    }
    if (user.career) {
      const sem = user.semester ? ` (${user.semester})` : '';
      return { label: 'Carrera', value: `${user.career}${sem}` };
    }
    return null;
  });

  // Visibilidad de contraseñas
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  toggleCurrentPassword() {
    this.showCurrentPassword.update((val) => !val);
  }

  toggleNewPassword() {
    this.showNewPassword.update((val) => !val);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update((val) => !val);
  }

  // Validador de coincidencia de contraseña
  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword')?.value;
    const confirmPass = control.get('confirmPassword')?.value;
    if (!newPass || !confirmPass) return null;
    return newPass === confirmPass ? null : { passwordMismatch: true };
  }

  // Formulario reactivo para Cambio de Contraseña
  passwordForm: FormGroup = this.fb.group(
    {
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },
    {
      validators: [this.passwordsMatchValidator]
    }
  );

  get isConfirmPasswordMismatch(): boolean {
    const confirmCtrl = this.passwordForm.get('confirmPassword');
    return !!(
      this.passwordForm.hasError('passwordMismatch') &&
      confirmCtrl?.touched &&
      confirmCtrl?.value
    );
  }

  // Modal feedback
  modalStatus = signal<'oculto' | 'cargando' | 'exito' | 'error'>('oculto');
  modalMessage1 = signal<string>('');
  modalMessage2 = signal<string>('');

  onPasswordSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.modalStatus.set('cargando');
    this.modalMessage1.set('Actualizando contraseña...');
    this.modalMessage2.set('Por favor espera un momento');

    setTimeout(() => {
      this.modalStatus.set('exito');
      this.modalMessage1.set('¡Contraseña actualizada!');
      this.modalMessage2.set('Tu contraseña se ha cambiado exitosamente.');

      setTimeout(() => {
        this.modalStatus.set('oculto');
        this.modalMessage1.set('');
        this.modalMessage2.set('');
        this.passwordForm.reset();
      }, 1500);
    }, 800);
  }

  // Tarjeta 3: Pantalla / Apariencia (conectada a ThemeService)
  darkMode = this.themeService.isDarkMode;
  canUseDarkMode = computed(() => {
    const role = this.userRole();
    return role === 'maestro' || role === 'administrador' || role === 'alumno';
  });
  selectedLanguage = signal('Español');
  languages = ['Español', 'Inglés', 'Francés', 'Alemán'];

  toggleDarkMode() {
    if (!this.canUseDarkMode()) return;
    this.themeService.toggleDarkMode();
  }

  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLanguage.set(select.value);
  }
}
