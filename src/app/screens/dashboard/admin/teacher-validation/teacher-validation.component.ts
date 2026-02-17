import { Component, signal, computed } from '@angular/core';
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

export interface TeacherRequest {
  id: string;
  name: string;
  email: string;
  employeeNumber: string;
  department: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-teacher-validation',
  standalone: true,
  // CommonModule es clave para usar el | date pipe en el HTML
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './teacher-validation.component.html'
})
export class TeacherValidationComponent {

  // Mapeo de iconos para usarlos en el HTML
  readonly icons = { Check, X, Eye, UserCheck, Mail, Briefcase, Hash };

  // ESTADO (Reemplaza a useState)
  requests = signal<TeacherRequest[]>([
    { id: '1', name: 'Dr. Sarah Williams', email: 'sarah.williams@university.edu', employeeNumber: '123456', department: 'Engineering', requestDate: '2026-02-10', status: 'approved' },
    { id: '2', name: 'Prof. Michael Chen', email: 'michael.chen@university.edu', employeeNumber: '123457', department: 'Computer Science', requestDate: '2026-02-11', status: 'pending' },
    { id: '3', name: 'Dr. Emily Brown', email: 'emily.brown@university.edu', employeeNumber: '123458', department: 'Mathematics', requestDate: '2026-02-12', status: 'pending' },
  ]);

  // ESTADOS DERIVADOS (Reemplaza los filter/length sueltos en el render)
  pendingRequests = computed(() => this.requests().filter(r => r.status === 'pending'));
  approvedRequests = computed(() => this.requests().filter(r => r.status === 'approved'));
  pendingCount = computed(() => this.pendingRequests().length);
  totalRequests = computed(() => this.requests().length);

  // MÉTODOS
  handleApprove(id: string) {
    console.log('Approving teacher:', id);
    // Lógica futura:
    // this.requests.update(reqs => reqs.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  }

  handleReject(id: string) {
    console.log('Rejecting teacher:', id);
  }

  handleViewDetails(id: string) {
    console.log('Viewing details for:', id);
  }
}
