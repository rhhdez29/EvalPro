import { Component, signal, computed, inject, afterNextRender } from '@angular/core';
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
import { DeleteModalComponent } from "../../../../../shared/components/delete-modal/delete-modal.component";
import { WarningModalComponent } from "../../../../../shared/components/warning-modal/warning-modal.component";


@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, DeleteModalComponent, WarningModalComponent],
  templateUrl: './users-list.component.html'
})
export class UsersListComponent {

  // Iconos
  readonly icons = { Search, UserPlus, MoreVertical, Edit, Trash2 };

  // --- ESTADOS BASE (Signals) ---
  searchQuery = signal('');
  roleFilter = signal<string>('all');
  isDeleteModalOpen = signal(false);
  isWarningModalOpen = signal(false);
  userStatus = signal(false);
  userIdSelected = signal<string>('');

  private usersService = inject(UsersService)

  // Filtro Combinado: Texto + Select de Rol
  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const filter = this.roleFilter();

    return this.users.value()!.filter(user => {
      const matchesSearch = user.complete_name.toLowerCase().includes(query) ||
                            user.email.toLowerCase().includes(query);
      const matchesRole = filter === 'all' || user.role === filter;

      return matchesSearch && matchesRole;
    });
  });

  // Estadísticas para las tarjetas superiores
  totalUsers = computed(() => this.users.value()?.length || 0);
  adminCount = computed(() => this.users.value()?.filter(u => u.role === 'administrador').length || 0);
  teacherCount = computed(() => this.users.value()?.filter(u => u.role === 'maestro').length || 0);
  studentCount = computed(() => this.users.value()?.filter(u => u.role === 'alumno').length || 0);

  users = rxResource({
    stream: () => this.usersService.getUsers(),
  })
  // --- MÉTODOS DE UI ---


  constructor() {
    afterNextRender(() => {
      this.users.reload();
    });
  }

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

  deleteUser() {
    this.usersService.deleteUser(this.userIdSelected()).subscribe({
      next: (user) => {
        this.users.reload()
        console.log(user);
      },
      error: (error) => {
        console.error(error);
      }
    })
    this.closeDeleteModal();
  }

  toggleUserStatus() {
    this.usersService.toggleUserStatus(this.userIdSelected()).subscribe({
      next: (user) => {
        this.users.reload()
      },
      error: (error) => {
        console.error(error);
      }
    })
    this.closeWarningModal()
  }

  openDeleteModal(userId: string) {
    this.isDeleteModalOpen.set(true);
    this.userIdSelected.set(userId);
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    this.userIdSelected.set('');
  }

  openWarningModal(userId: string, status: boolean) {
    this.isWarningModalOpen.set(true);
    this.userIdSelected.set(userId);
    this.userStatus.set(status);
  }

  closeWarningModal() {
    this.isWarningModalOpen.set(false);
    this.userIdSelected.set('');
  }
}
