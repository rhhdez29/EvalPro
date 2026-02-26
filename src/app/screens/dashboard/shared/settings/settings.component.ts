import { Component, inject, linkedSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  User,
  Mail,
  Phone,
  Building,
  Save,
  Bell,
  Lock,
  Globe,
  Moon,
  Eye
} from 'lucide-angular';
import { FacadeService } from '../../../../services/facade.service';
import { FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { SettingsTeacherComponent } from './components/settings-teacher/settings-teacher.component';
import { SettingsStudentComponent } from './components/settings-student/settings-student.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, SettingsTeacherComponent, SettingsStudentComponent],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {

  facadeService = inject(FacadeService);
  private fb = inject(FormBuilder);


  // Iconos
  readonly icons = { User, Mail, Phone, Building, Save, Bell, Lock, Globe, Moon, Eye };

  // ESTADO: Pestaña activa (profile, stats, preferences)
  activeTab = signal<'profile' | 'stats' | 'preferences'>('profile');
  userData = linkedSignal(() => this.facadeService.currentUser());

  constructor() {
    console.log(this.userData());
  }

  myForm = this.fb.group({
    name: [this.userData().name, [Validators.required]],
    email: [this.userData().email, [Validators.required]],
  });



  // MÉTODOS
  setTab(tab: 'profile' | 'stats' | 'preferences') {
    this.activeTab.set(tab);
  }
}
