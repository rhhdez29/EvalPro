import { Component, computed, EventEmitter, inject, linkedSignal, output, Output, signal } from '@angular/core';
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
  UserCheck,
  X
} from 'lucide-angular';
import { FacadeService } from '../../../../core/services/facade.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalState } from '../../../../core/models/ModalState';
import { UsersService } from '../../services/users.service';

// Interfaz para el menú
export interface MenuItem {
  path: string;
  label: string;
  icon: any;
  badge?: number;
}

@Component({
  selector: 'side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, RouterLinkActive],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  private router = inject(Router);
  private facadeService = inject(FacadeService);

  @Output() linkClicked = new EventEmitter<void>();
  modalStateChange = output<ModalState>();

  // Iconos
  readonly icons = { GraduationCap, User, LogOut, BookOpen, Settings, Users, UserCheck, X, ReactiveFormsModule };

  userRole = this.facadeService.userRole;
  userName = this.facadeService.userName;
  userService = inject(UsersService);

  // Equivalente al useMemo de React
  menuItems = computed<MenuItem[]>(() => {
    switch (this.userRole()) {
      case 'administrador':
        return [
          { path: 'admin/validation', label: 'Validación de Profesores', icon: this.icons.UserCheck, badge: this.userService.pendingTeachersCount() },
          { path: 'teacher/subjects', label: 'Mis Materias', icon: this.icons.GraduationCap },
          { path: 'admin/subjects', label: 'Gestión de Materias', icon: this.icons.BookOpen },
          { path: 'admin/users-list', label: 'Usuarios', icon: this.icons.Users },
          { path: 'settings', label: 'Configuración', icon: this.icons.Settings },
        ];
      case 'maestro':
        return [
          { path: 'teacher/subjects', label: 'Mis Materias', icon: this.icons.BookOpen },
          { path: 'settings', label: 'Configuración', icon: this.icons.Settings },
        ];
      case 'alumno':
        return [
          { path: 'student/classes', label: 'Mis Clases', icon: this.icons.BookOpen },
          { path: 'settings', label: 'Configuración', icon: this.icons.Settings },
        ];
      default:
        return [];
    }
  });

  ngOnInit() {
    if (this.userRole() === 'administrador') {
      this.userService.getTeacherRequests().subscribe({
        next: (response) => {
          this.userService.pendingTeachersCount.set(response.length);
        },
        error: (err) => {
          this.userService.pendingTeachersCount.set(0);
        }
      });
    }
  }

  Logout() {
    this.modalStateChange.emit({
      status: 'cargando',
      title: 'Cargando',
      subtitle: 'Estamos procesando tu solicitud...'
    });

    this.facadeService.logout().subscribe({
      next: (response) => {
        this.modalStateChange.emit({
          status: 'exito',
          title: 'Cerrando Sesión',
          subtitle: 'Espere un momento...'
        });

        setTimeout(() => {
          this.modalStateChange.emit({
            status: 'oculto',
            title: '',
            subtitle: ''
          });
          this.facadeService.destroyUser();
          this.router.navigate(['auth/login']);
        }, 3000);
      },
      error: (err) => {
        this.facadeService.destroyUser();
        const mensajeError = err.error?.detail || 'Hubo un error en el servidor';

        this.modalStateChange.emit({
          status: 'error',
          title: 'Uy, algo salió mal...',
          subtitle: mensajeError
        });

        setTimeout(() => {
          this.modalStateChange.emit({
            status: 'oculto',
            title: '',
            subtitle: ''
          });
        }, 3000);
      }
    });
  }
}
