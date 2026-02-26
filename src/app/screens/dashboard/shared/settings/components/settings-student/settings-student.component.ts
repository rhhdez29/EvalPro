import { Component, input } from '@angular/core';
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

@Component({
  selector: 'settings-student',
  imports: [ LucideAngularModule ],
  templateUrl: './settings-student.component.html',
})
export class SettingsStudentComponent {


  activeTab = input.required()

  // Iconos
  readonly icons = { User, Mail, Phone, Building, Save, Bell, Lock, Globe, Moon, Eye };

  // DATOS ESTÁTICOS
  readonly notificationsList = [
    { label: 'Email notifications', desc: 'Receive email updates', checked: true },
    { label: 'Student submissions', desc: 'Alert when students submit', checked: true },
    { label: 'Exam reminders', desc: 'Get reminded before exams', checked: false },
    { label: 'Weekly reports', desc: 'Weekly performance summaries', checked: false },
  ];

  // Datos de las gráficas (Listos para cuando instales ng2-charts o ngx-echarts)
  readonly examStatsData = [
    { month: 'Jul', exams: 12, students: 245 },
    { month: 'Aug', exams: 18, students: 312 },
    { month: 'Sep', exams: 15, students: 289 },
    { month: 'Oct', exams: 22, students: 378 },
    { month: 'Nov', exams: 19, students: 334 },
    { month: 'Dec', exams: 25, students: 421 },
    { month: 'Jan', exams: 28, students: 468 },
  ];

  readonly performanceData = [
    { subject: 'Math', avgScore: 85 },
    { subject: 'Physics', avgScore: 78 },
    { subject: 'Chemistry', avgScore: 92 },
    { subject: 'Biology', avgScore: 88 },
    { subject: 'CS', avgScore: 95 },
  ];

  onSubmit() {
    throw new Error('Method not implemented.');
  }

}
