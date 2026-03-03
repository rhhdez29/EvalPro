import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  GraduationCap,
  User,
  LogOut,
  BookOpen,
  Settings,
  Users,
  UserCheck
} from 'lucide-angular';
import { FacadeService } from '../../../services/facade.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingModalComponent } from "../../../shared/modals/loading-modal/loading-modal.component";

// Interfaz para el menú
export interface MenuItem {
  path: string;
  label: string;
  icon: any;
  badge?: number;
}

// Simulamos el AuthContext (En el futuro inyectarás tu AuthService)
export interface MockUser {
  name: string;
  role: 'administrator' | 'teacher' | 'student';
}

@Component({
  selector: 'side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, RouterLinkActive, LoadingModalComponent],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  private router = inject(Router);
  private facadeService = inject(FacadeService);

  // Iconos
  readonly icons = { GraduationCap, User, LogOut, BookOpen, Settings, Users, UserCheck, ReactiveFormsModule };

  userRole = this.facadeService.userRole;
  userName = this.facadeService.userName;

  modalStatus = signal<'oculto' | 'cargando' | 'exito' | 'error'>('oculto');
  messageModal1 = signal<string>('');
  messageModal2 = signal<string>('');


  // Equivalente al useMemo de React
  menuItems = computed<MenuItem[]>(() => {
    switch (this.userRole()) {
      case 'administrador':
        return [
          { path: 'admin/validation', label: 'Teacher Validation', icon: this.icons.UserCheck, badge: 3 },
          { path: 'admin/subjects', label: 'Subject Management', icon: this.icons.BookOpen },
          { path: 'admin/users-list', label: 'Users', icon: this.icons.Users },
          { path: 'user/settings', label: 'Settings', icon: this.icons.Settings },
        ];
      case 'maestro':
        return [
          { path: 'teacher/subjects', label: 'My Subjects', icon: this.icons.BookOpen },
          { path: 'user/settings', label: 'Settings', icon: this.icons.Settings },
        ];
      case 'alumno':
        return [
          { path: 'student/classes', label: 'My Classes', icon: this.icons.BookOpen },
          { path: 'user/settings', label: 'Settings', icon: this.icons.Settings },
        ];
      default:
        return [];
    }
  });

  Logout() {

    this.modalStatus.set('cargando');
    this.messageModal1.set('Cargando');
    this.messageModal2.set('Estamos procesando tu solicitud...')

    this.facadeService.logout().subscribe({
      next: (response) => {

        this.modalStatus.set('exito');
        this.messageModal1.set('Cerrando Sesion');
        this.messageModal2.set('Espere un momento...')

        setTimeout(() => {
          this.modalStatus.set('oculto');
          this.facadeService.destroyUser();
          this.router.navigate(['auth/login']);
        }, 3000);

      },
      error: (err) => {
        this.facadeService.destroyUser();
        // Manejo de errores (credenciales incorrectas)
        this.modalStatus.set('error');
        const mensajeError = err.error?.detail || 'Hubo un error en el servidor'

        this.messageModal1.set('Uy, algo salió mal...');
        this.messageModal2.set(mensajeError);

        setTimeout(() => {
          this.modalStatus.set('oculto');
        }, 3000);
      }
    })
  }



}
