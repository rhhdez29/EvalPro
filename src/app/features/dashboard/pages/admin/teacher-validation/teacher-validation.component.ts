import { Component, signal, computed, inject, afterNextRender, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Check,
  X,
  Eye,
  UserCheck,
  Mail,
  Briefcase,
  Hash
} from 'lucide-angular';
import { rxResource } from '@angular/core/rxjs-interop';
import { UsersService } from '../../../services/users.service';
import { WarningModalComponent } from "../../../../../shared/components/warning-modal/warning-modal.component";
import { LandingComponent } from "../../../../landing/pages/landing.component";
import { LoadingModalComponent } from "../../../../../shared/components/loading-modal/loading-modal.component";
import { ModalState } from '../../../../../core/models/ModalState';
@Component({
  selector: 'app-teacher-validation',
  standalone: true,
  // CommonModule es clave para usar el | date pipe en el HTML
  imports: [CommonModule, LucideAngularModule, WarningModalComponent, LoadingModalComponent],
  templateUrl: './teacher-validation.component.html'
})
export class TeacherValidationComponent {

  // Mapeo de iconos para usarlos en el HTML
  readonly icons = { Check, X, Eye, UserCheck, Mail, Briefcase, Hash };

  private usersService = inject(UsersService);
  id_teacher_selected = signal<string>('');
  isApproveModalOpen = signal(false);
  isRejectModalOpen = signal(false);
  modalState = signal<ModalState>({
    status: 'oculto',
    title: '',
    subtitle: ''
  });


  // ESTADOS DERIVADOS (Reemplaza los filter/length sueltos en el render)
  // pendingRequests = computed(() => this.teacherRequest().filter(r => r.status === 'pending'));
  // approvedRequests = computed(() => this.teacherRequest.value()?.filter(r => r.status === 'approved'));
  pendingCount = computed(() => this.teacherRequest.value()?.length ?? 0);
  // totalRequests = computed(() => this.teacherRequest().length);

  teacherRequest = rxResource({
    stream: () => this.usersService.getTeacherRequests()
  })

  constructor(){
    afterNextRender(() => {
      this.teacherRequest.reload();
    });
  }

  // MÉTODOS
  openApproveModal(id: string) {
    this.id_teacher_selected.set(id);
    this.isApproveModalOpen.set(true);
    console.log(id)
  }

  openRejectModal(id: string) {
    this.id_teacher_selected.set(id);
    this.isRejectModalOpen.set(true);
  }

  handleViewDetails(id: string) {
  }

  closeApproveModal() {
    this.isApproveModalOpen.set(false);
    this.id_teacher_selected.set('');
  }

  closeRejectModal() {
    this.isRejectModalOpen.set(false);
    this.id_teacher_selected.set('');
  }

  approveTeacher() {
    this.modalState.set({
      status: 'cargando',
      title: 'Cargando',
      subtitle: 'Estamos procesando tu solicitud...'
    });
    this.usersService.approveTeacher(this.id_teacher_selected()).subscribe({
      next: () => {
        this.modalState.set({
          status: 'exito',
          title: 'Maestro aprobado',
          subtitle: 'El maestro ha sido aprobado exitosamente.'
        });
        setTimeout(() => {
          this.modalState.set({
            status: 'oculto',
            title: '',
            subtitle: ''
          });
          this.closeApproveModal();
          this.teacherRequest.reload();
        }, 3000);
        this.usersService.updatePendingTeachersCount(this.pendingCount() - 1);
      }
      ,
      error: (err) => {
        this.modalState.set({
          status: 'error',
          title: 'Error',
          subtitle: err.error?.detail || 'Hubo un error en el servidor'
        });
        setTimeout(() => {
          this.modalState.set({
            status: 'oculto',
            title: '',
            subtitle: ''
          });
          this.closeApproveModal();
          this.teacherRequest.reload();
        }, 3000);
      }
    });
  }

  rejectTeacher() {

    this.modalState.set({
      status: 'cargando',
      title: 'Cargando',
      subtitle: 'Estamos procesando tu solicitud...'
    });
    this.usersService.rejectTeacher(this.id_teacher_selected()).subscribe({
      next: () => {
        this.modalState.set({
          status: 'exito',
          title: 'Maestro rechazado',
          subtitle: 'El maestro ha sido rechazado exitosamente.'
        });
        setTimeout(() => {
          this.modalState.set({
            status: 'oculto',
            title: '',
            subtitle: ''
          });
          this.closeRejectModal();
          this.teacherRequest.reload();
        }, 3000);
        this.usersService.updatePendingTeachersCount(this.pendingCount() - 1);
      }
      ,
      error: (err) => {
        this.modalState.set({
          status: 'error',
          title: 'Error',
          subtitle: err.error?.detail || 'Hubo un error en el servidor'
        });
        setTimeout(() => {
          this.modalState.set({
            status: 'oculto',
            title: '',
            subtitle: ''
          });
          this.closeRejectModal();
          this.teacherRequest.reload();
        }, 3000);
      }
    });
  }

}
