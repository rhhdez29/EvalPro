import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  //REDIRECCIÓN INICIAL
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  // LANDING PAGE
  {
    path: 'landing',
    loadComponent: () => import('./features/landing/pages/landing.component').then(m => m.LandingComponent),
  },
  //MÓDULO DE AUTENTICACIÓN
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      // Si entran a '/auth' directo, los mandamos al login
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('./features/auth/pages/auth-login/auth-login.component').then(m => m.AuthLoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/pages/auth-register/auth-register.component').then(m => m.AuthRegisterComponent) }
    ]
  },

  //MÓDULO PRINCIPAL (Dashboard / App)
  {
    path: 'home',
    loadComponent: () => import('./features/dashboard/layout/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    // Aquí en el futuro pondremos: canActivate: [authGuard]
    children: [

      // --- ZONA DE ADMINISTRADOR ---
      {
        path: 'admin',
        canActivate: [roleGuard(['administrador'])],
        children: [
          { path: 'validation', loadComponent: () => import('./features/dashboard/pages/admin/teacher-validation/teacher-validation.component').then(m => m.TeacherValidationComponent) },
          { path: 'subjects', loadComponent: () => import('./features/dashboard/pages/admin/subject-management/subject-management.component').then(m => m.SubjectManagementComponent) },
          { path: 'users-list', loadComponent: () => import('./features/dashboard/pages/admin/users-list/users-list.component').then(m => m.UsersListComponent) },
          { path: 'exam/:id', loadComponent: () => import('./features/dashboard/pages/shared-pages/exam-viewer/exam-viewer.component').then(m => m.ExamViewerComponent) }
        ]
      },

      // --- ZONA DE PROFESOR ---
      {
        path: 'teacher',
        canActivate: [roleGuard(['maestro'])],
        children: [
          { path: 'subjects', loadComponent: () => import('./features/dashboard/pages/teacher/subjects/subjects.component').then(m => m.SubjectsComponent) },
          { path: 'exam/:id', loadComponent: () => import('./features/dashboard/pages/shared-pages/exam-viewer/exam-viewer.component').then(m => m.ExamViewerComponent) }
        ]
      },

      // --- ZONA DE ALUMNO ---
      {
        path: 'student',
        canActivate: [roleGuard(['alumno'])],
        children: [
          { path: 'classes', loadComponent: () => import('./features/dashboard/pages/student/classes/classes.component').then(m => m.ClassesComponent) },
          { path: 'exam/:id', loadComponent: () => import('./features/dashboard/pages/shared-pages/exam-viewer/exam-viewer.component').then(m => m.ExamViewerComponent) }
        ]
      },

      // --- ZONA COMPARTIDA (Shared) ---
      {
        path: 'settings',
        canActivate: [roleGuard(['administrador', 'maestro', 'alumno'])],
        loadComponent: () => import('./features/dashboard/pages/shared-pages/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'subject/:id',
        canActivate: [roleGuard(['administrador', 'maestro', 'alumno'])],
        loadComponent: () => import('./features/dashboard/pages/shared-pages/subject-detail/subject-detail.component').then(m => m.SubjectDetailComponent)
      },

    ]
  },

  { path: '**', redirectTo: 'landing' },

];
