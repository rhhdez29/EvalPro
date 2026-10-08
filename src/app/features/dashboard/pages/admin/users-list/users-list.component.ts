import { Component, signal, computed, inject, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { ModalState } from '../../../../../core/models/ModalState';
import { LoadingModalComponent } from "../../../../../shared/components/loading-modal/loading-modal.component";
import { PaginationComponent } from "../../../../../shared/components/pagination/pagination.component";

const PAGE_SIZE = 10;

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    FormsModule,
    DeleteModalComponent,
    WarningModalComponent,
    LoadingModalComponent,
    PaginationComponent,
  ],
  templateUrl: './users-list.component.html'
})
export class UsersListComponent {

  // Iconos
  readonly icons = { Search, UserPlus, MoreVertical, Edit, Trash2 };

  // --- ESTADOS BASE (Signals) ---
  currentPage      = signal(1);
  searchQuery      = signal('');
  roleFilter       = signal<string>('all');
  isDeleteModalOpen  = signal(false);
  isWarningModalOpen = signal(false);
  userStatus       = signal(false);
  userIdSelected   = signal<string>('');

  modalState = signal<ModalState>({
    status: 'oculto',
    title: '',
    subtitle: ''
  });

  private usersService = inject(UsersService);

  // --- RX RESOURCE reactivo a currentPage ---
  users = rxResource({
    params: () => this.currentPage(),
    stream: ({ params: page }) => this.usersService.getUsers(page),
  });

  // --- ESTADOS DERIVADOS ---

  // Filtro local dentro de la página actual
  filteredUsers = computed(() => {
    const query  = this.searchQuery().toLowerCase();
    const filter = this.roleFilter();
    const results = this.users.value()?.results ?? [];

    return results.filter(user => {
      const matchesSearch = user.complete_name.toLowerCase().includes(query) ||
                            user.email.toLowerCase().includes(query);
      const matchesRole   = filter === 'all' || user.role === filter;
      return matchesSearch && matchesRole;
    });
  });

  // Paginación
  totalCount  = computed(() => this.users.value()?.count ?? 0);
  totalPages  = computed(() => Math.max(1, Math.ceil(this.totalCount() / PAGE_SIZE)));
  hasNext     = computed(() => !!this.users.value()?.next);
  hasPrevious = computed(() => !!this.users.value()?.previous);

  // Estadísticas (de la página actual)
  totalUsers   = computed(() => this.users.value()?.count ?? 0);
  adminCount   = computed(() => this.users.value()?.results?.filter(u => u.role === 'administrador').length ?? 0);
  teacherCount = computed(() => this.users.value()?.results?.filter(u => u.role === 'maestro').length ?? 0);
  studentCount = computed(() => this.users.value()?.results?.filter(u => u.role === 'alumno').length ?? 0);

  constructor() {
    afterNextRender(() => {
      this.users.reload();
    });
  }

  // --- PAGINACIÓN ---
  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  // --- MÉTODOS DE UI ---
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
    this.modalState.set({
      status: 'cargando',
      title: 'Cargando',
      subtitle: 'Estamos procesando tu solicitud...'
    });
    this.usersService.deleteUser(this.userIdSelected()).subscribe({
      next: (user) => {
        this.modalState.set({
          status: 'exito',
          title: 'Listo!',
          subtitle: 'Usuario eliminado con éxito'
        });
        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
          this.users.reload();
        }, 3000);
        console.log(user);
      },
      error: (error) => {
        this.modalState.set({
          status: 'error',
          title: 'Uy, algo salió mal...',
          subtitle: error.error?.detail || 'Hubo un error en el servidor'
        });
        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
        }, 3000);
      }
    });
    this.closeDeleteModal();
  }

  toggleUserStatus() {
    this.modalState.set({
      status: 'cargando',
      title: 'Cargando',
      subtitle: 'Estamos procesando tu solicitud...'
    });
    this.usersService.toggleUserStatus(this.userIdSelected()).subscribe({
      next: (user) => {
        this.modalState.set({
          status: 'exito',
          title: 'Listo!',
          subtitle: 'Estado del usuario actualizado con éxito'
        });
        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
          this.users.reload();
        }, 3000);
      },
      error: (error) => {
        this.modalState.set({
          status: 'error',
          title: 'Uy, algo salió mal...',
          subtitle: error.error?.detail || 'Hubo un error en el servidor'
        });
        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
        }, 3000);
      }
    });
    this.closeWarningModal();
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
