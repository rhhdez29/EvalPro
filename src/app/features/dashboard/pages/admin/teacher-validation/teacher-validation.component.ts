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
  loadingModal = signal <'oculto' | 'cargando' | 'exito' | 'error'>('oculto');
  isRejectModalOpen = signal(false);
  message1 = signal<string>('');
  message2 = signal<string>('');



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
    this.loadingModal.set('cargando');
    this.message1.set('Cargando');
    this.message2.set('Estamos procesando tu solicitud...')
    this.usersService.approveTeacher(this.id_teacher_selected()).subscribe({
      next: () => {
        this.loadingModal.set('exito');
        this.message1.set('Solicitud aprobada');
        this.message2.set('La solicitud ha sido aprobada exitosamente.');
        setTimeout(() => {
          this.loadingModal.set('oculto');
          this.closeApproveModal();
          this.teacherRequest.reload();
        }, 3000);
        this.usersService.updatePendingTeachersCount(this.pendingCount() - 1);
      }
      ,
      error: (err) => {
        this.loadingModal.set('error');
        this.message1.set('Error');
        this.message2.set('La solicitud no pudo ser procesada.');
        setTimeout(() => {
          this.loadingModal.set('oculto');
          this.closeApproveModal();
          this.teacherRequest.reload();
        }, 3000);
      }
    });
  }

  rejectTeacher() {

    this.loadingModal.set('cargando');
    this.message1.set('Cargando');
    this.message2.set('Estamos procesando tu solicitud...')

    this.usersService.rejectTeacher(this.id_teacher_selected()).subscribe({
      next: () => {
        this.loadingModal.set('exito');
        this.message1.set('Solicitud rechazada');
        this.message2.set('La solicitud ha sido rechazada exitosamente.');

        setTimeout(() => {
          this.loadingModal.set('oculto');
          this.closeRejectModal();
          this.teacherRequest.reload();
        }, 3000);
        this.usersService.updatePendingTeachersCount(this.pendingCount() - 1);
      }
      ,
      error: (err) => {
        this.loadingModal.set('error');
        this.message1.set('Error');
        this.message2.set('La solicitud no pudo ser procesada.');
        setTimeout(() => {
          this.loadingModal.set('oculto');
          this.closeRejectModal();
          this.teacherRequest.reload();
        }, 3000);
      }
    });
  }

}
