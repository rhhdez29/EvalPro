import { Routes } from '@angular/router';
import path from 'path';

export const routes: Routes = [
  {
    path: 'landing',
    loadComponent: () => import('./screens/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'auth', // Puedes llamarle 'login' si prefieres, pero 'auth' engloba ambos
    loadComponent: () => import('./screens/auth/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: 'login', loadComponent: () => import('./screens/auth/auth-login/auth-login.component').then(m => m.AuthLoginComponent) },
      { path: 'register', loadComponent: () => import('./screens/auth/auth-register/auth-register.component').then(m => m.AuthRegisterComponent) }
    ]
  },
  {
    path: 'home',
    loadComponent: () => import('./screens/dashboard/layout/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [

      { path: 'admin/validation', loadComponent: () => import('./screens/dashboard//admin/teacher-validation/teacher-validation.component').then(m => m.TeacherValidationComponent) },
      { path: 'admin/subjects', loadComponent: () => import('./screens/dashboard//admin/subject-management/subject-management.component').then(m => m.SubjectManagementComponent) },
      { path: 'admin/users-list', loadComponent: () => import('./screens/dashboard//admin/users-list/users-list.component').then(m => m.UsersListComponent) },

      { path: 'teacher/subjects', loadComponent: () => import('./screens/dashboard/teacher/subjects/subjects.component').then(m => m.SubjectsComponent)},

      {path: "student/classes", loadComponent: () => import('./screens/dashboard/student/classes/classes.component').then(m => m.ClassesComponent)},

      {path:  "user/settings", loadComponent: () => import('./screens/dashboard/shared/settings/settings.component').then(m => m.SettingsComponent)}

    ]
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  }
];
