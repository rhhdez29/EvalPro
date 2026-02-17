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

  // Iconos
  readonly icons = { GraduationCap, User, LogOut, BookOpen, Settings, Users, UserCheck };

  // Simulamos el usuario logueado (Equivalente al useAuth de React)
  user = signal<MockUser | null>({ name: 'Rafael Hdez', role: 'administrator' });

  // Equivalente al useMemo de React
  menuItems = computed<MenuItem[]>(() => {
    const currentUser = this.user();
    if (!currentUser) return [];

    switch (currentUser.role) {
      case 'administrator':
        return [
          { path: 'admin/validation', label: 'Teacher Validation', icon: this.icons.UserCheck, badge: 3 },
          { path: 'admin/subjects', label: 'Subject Management', icon: this.icons.BookOpen },
          { path: 'admin/users-list', label: 'Users', icon: this.icons.Users },
          { path: 'admin/settings', label: 'Settings', icon: this.icons.Settings },
        ];
      case 'teacher':
        return [
          { path: '/app/my-subjects', label: 'My Subjects', icon: this.icons.BookOpen },
          { path: '/app/settings', label: 'Settings', icon: this.icons.Settings },
        ];
      case 'student':
        return [
          { path: '/app/my-classes', label: 'My Classes', icon: this.icons.BookOpen },
          { path: '/app/settings', label: 'Settings', icon: this.icons.Settings },
        ];
      default:
        return [];
    }
  });

  handleLogout() {
    // Aquí llamarás a tu logout real
    this.router.navigate(['/auth/login']);
  }



}
