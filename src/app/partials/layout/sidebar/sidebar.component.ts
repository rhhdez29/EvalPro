import { Component, computed, inject, signal } from '@angular/core';
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
  imports: [CommonModule, RouterLink, LucideAngularModule, RouterLinkActive],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  private router = inject(Router);
  private facadeService = inject(FacadeService);

  // Iconos
  readonly icons = { GraduationCap, User, LogOut, BookOpen, Settings, Users, UserCheck };

  userData = this.facadeService.currentUser;

  isLoading = false;
  errorMessage = '';


  // Equivalente al useMemo de React
  menuItems = computed<MenuItem[]>(() => {
    const currentUserData = this.userData()

    console.log('cookies: ',this.userData());
    switch (this.userData().group) {
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
    // Aquí llamarás a tu logout real
    this.facadeService.logout().subscribe({
      next: (response) => {
        this.facadeService.destroyUser();
        this.router.navigate(['auth/login']);
        this.isLoading = false;
      },
      error: (err) => {
        this.facadeService.destroyUser();
        // Manejo de errores (credenciales incorrectas)
        this.isLoading = false;
        if (err.status === 400 || err.status === 403 || err.status === 404) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else {
          this.errorMessage = 'Error de conexión con el servidor.';
        }
        console.error('Error de login:', err);
      }
    })
  }



}
