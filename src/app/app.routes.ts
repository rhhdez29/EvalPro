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
    loadComponent: () => import('./partials/layout/sidebar/sidebar.component').then(m => m.SidebarComponent),
    children: [

      { path: 'dashboard', loadComponent: () => import('./screens/dashboard/dashboard.component').then(m => m.DashboardComponent) },

    ]
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  }
];
