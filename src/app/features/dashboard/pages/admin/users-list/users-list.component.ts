import { Component, signal, computed, inject } from '@angular/core';
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
import { rxResource } from '@angular/core/rxjs-interop';
import { UsersService } from '../../../services/users.service';
import { UserList } from '../../../models/UserList.interface';


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
  users = signal<UserList[]>([]);
  roleFilter = signal<string>('all');

  private usersService = inject(UsersService)

  // Filtro Combinado: Texto + Select de Rol
  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const filter = this.roleFilter();

    return this.users().filter(user => {
      const matchesSearch = user.complete_name.toLowerCase().includes(query) ||
                            user.email.toLowerCase().includes(query);
      const matchesRole = filter === 'all' || user.role === filter;

      return matchesSearch && matchesRole;
    });
  });

  // Estadísticas para las tarjetas superiores
  totalUsers = computed(() => this.users().length);
  adminCount = computed(() => this.users().filter(u => u.role === 'administrador').length);
  teacherCount = computed(() => this.users().filter(u => u.role === 'maestro').length);
  studentCount = computed(() => this.users().filter(u => u.role === 'alumno').length);

  ngOnInit(){
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        console.log(users);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
  // --- MÉTODOS DE UI ---

  // En Angular evitamos devolver JSX/HTML desde el TS.
  // Evaluamos las clases CSS directamente, y el HTML dibuja la etiqueta.
  getRoleBadgeClass(role: UserList['role']): string {
    const styles = {
      administrador: 'bg-red-100 text-red-700 border-red-300',
      maestro: 'bg-blue-100 text-blue-700 border-blue-300',
      alumno: 'bg-green-100 text-green-700 border-green-300',
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
