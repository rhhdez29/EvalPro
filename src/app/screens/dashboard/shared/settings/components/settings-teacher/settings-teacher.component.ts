import { Component, computed, effect, inject, input } from '@angular/core';
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
import { Teacher, UserSesion } from '../../../../../../shared/interfaces/user.inteface';
import { FACULTIES } from '../../../../../../shared/constants/academic-data';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs';

@Component({
  selector: 'settings-teacher',
  imports: [ LucideAngularModule, ReactiveFormsModule ],
  templateUrl: './settings-teacher.component.html',
})
export class SettingsTeacherComponent {


  activeTab = input.required()
  user = input.required<UserSesion | null>();

  private fb = inject(FormBuilder);

  listFaculties = FACULTIES;

  // Iconos
  readonly icons = { User, Mail, Phone, Building, Save, Bell, Lock, Globe, Moon, Eye };

  myForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    id_teacher: ['', Validators.required],
    faculty: ['', Validators.required]
  })

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

  constructor(){


    effect(()=> {
      const teacherData = this.user() as Teacher;

      this.myForm.patchValue({
        firstName: teacherData.firtsName,
        lastName: teacherData.lastName,
        id_teacher: teacherData.id_teacher,
        faculty: teacherData.faculty
      })
    })

  }


  onSubmit() {
    throw new Error('Method not implemented.');
  }

}
