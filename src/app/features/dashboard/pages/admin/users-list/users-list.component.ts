import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import {
  LucideAngularModule,
  Search,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-angular';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrator' | 'teacher' | 'student';
  department?: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './users-list.component.html'
})
export class UsersListComponent {

  // Iconos
  readonly icons = { Search, UserPlus, MoreVertical, Edit, Trash2 };

  // --- ESTADOS BASE (Signals) ---
  searchQuery = signal('');
  roleFilter = signal<string>('all');

  users = signal<User[]>([
    { id: '1', name: 'Admin User', email: 'admin@university.edu', role: 'administrator', status: 'active' },
    { id: '2', name: 'Prof. Johnson', email: 'johnson@university.edu', role: 'teacher', department: 'Mathematics', status: 'active' },
    { id: '3', name: 'Dr. Smith', email: 'smith@university.edu', role: 'teacher', department: 'Computer Science', status: 'active' },
    { id: '4', name: 'John Doe', email: 'john.doe@university.edu', role: 'student', status: 'active' },
  ]);

  // --- ESTADOS DERIVADOS (Filtros y Estadísticas) ---

  // Filtro Combinado: Texto + Select de Rol
  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const filter = this.roleFilter();

    return this.users().filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(query) ||
                            user.email.toLowerCase().includes(query);
      const matchesRole = filter === 'all' || user.role === filter;

      return matchesSearch && matchesRole;
    });
  });

  // Estadísticas para las tarjetas superiores
  totalUsers = computed(() => this.users().length);
  adminCount = computed(() => this.users().filter(u => u.role === 'administrator').length);
  teacherCount = computed(() => this.users().filter(u => u.role === 'teacher').length);
  studentCount = computed(() => this.users().filter(u => u.role === 'student').length);

  // --- MÉTODOS DE UI ---

  // En Angular evitamos devolver JSX/HTML desde el TS.
  // Evaluamos las clases CSS directamente, y el HTML dibuja la etiqueta.
  getRoleBadgeClass(role: User['role']): string {
    const styles = {
      administrator: 'bg-red-100 text-red-700 border-red-300',
      teacher: 'bg-blue-100 text-blue-700 border-blue-300',
      student: 'bg-green-100 text-green-700 border-green-300',
    };
    return styles[role];
  }

  handleAddUser() {
    console.log('Add User clicked');
  }

  handleUserOptions(userId: string) {
    console.log('Options for user:', userId);
  }
}
