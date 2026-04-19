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
@Component({
  selector: 'app-teacher-validation',
  standalone: true,
  // CommonModule es clave para usar el | date pipe en el HTML
  imports: [CommonModule, LucideAngularModule, WarningModalComponent],
  templateUrl: './teacher-validation.component.html'
})
export class TeacherValidationComponent {

  // Mapeo de iconos para usarlos en el HTML
  readonly icons = { Check, X, Eye, UserCheck, Mail, Briefcase, Hash };

  private usersService = inject(UsersService);
  id_teacher_selected = signal<string>('');
  isApproveModalOpen = signal(false);
  isRejectModalOpen = signal(false);


  // ESTADOS DERIVADOS (Reemplaza los filter/length sueltos en el render)
  // pendingRequests = computed(() => this.teacherRequest().filter(r => r.status === 'pending'));
  // approvedRequests = computed(() => this.teacherRequest().filter(r => r.status === 'approved'));
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
    this.usersService.approveTeacher(this.id_teacher_selected()).subscribe({
      next: () => {
        this.closeApproveModal();
        this.teacherRequest.reload();
      }
      ,
      error: (err) => {
        console.error(err);
      }
    });
  }

  rejectTeacher() {
    this.usersService.rejectTeacher(this.id_teacher_selected()).subscribe({
      next: () => {
        this.closeRejectModal();
        this.teacherRequest.reload();
      }
      ,
      error: (err) => {
        console.error(err);
      }
    });
  }

}
