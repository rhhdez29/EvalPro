import { Routes } from '@angular/router';

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
        // Aquien un futuro pondremos canActivate: [roleGuard('admin')]
        children: [
          { path: 'validation', loadComponent: () => import('./features/dashboard/pages/admin/teacher-validation/teacher-validation.component').then(m => m.TeacherValidationComponent) },
          { path: 'subjects', loadComponent: () => import('./features/dashboard/pages/admin/subject-management/subject-management.component').then(m => m.SubjectManagementComponent) },
          { path: 'users-list', loadComponent: () => import('./features/dashboard/pages/admin/users-list/users-list.component').then(m => m.UsersListComponent) },
        ]
      },

      // --- ZONA DE PROFESOR ---
      {
        path: 'teacher',
        children: [
          { path: 'subjects', loadComponent: () => import('./features/dashboard/pages/teacher/subjects/subjects.component').then(m => m.SubjectsComponent) },
        ]
      },

      // --- ZONA DE ALUMNO ---
      {
        path: 'student',
        children: [
          { path: 'classes', loadComponent: () => import('./features/dashboard/pages/student/classes/classes.component').then(m => m.ClassesComponent) },
        ]
      },

      // --- ZONA COMPARTIDA (Shared) ---
      {
        path: 'settings',
        loadComponent: () => import('./features/dashboard/pages/shared-pages/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'subject/:id',
        loadComponent: () => import('./features/dashboard/pages/shared-pages/subject-detail/subject-detail.component').then(m => m.SubjectDetailComponent)
      }
    ]
  },

];
