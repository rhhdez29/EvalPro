import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { LucideAngularModule, Bell, Menu } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, LucideAngularModule],
  templateUrl: './dashboard-layout.component.html'
})
export class DashboardLayoutComponent {
  readonly icons = { Bell, Menu };
  private router = inject(Router);

  isSidebarOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  // Escuchamos los cambios de URL para actualizar el Título automáticamente
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  pageTitle = computed(() => {
    const url = this.currentUrl();

    if (url.includes('validation')) return 'Validación de Profesores';
    if (url.includes('subjects')) return 'Gestión de Materias';
    if (url.includes('classes')) return 'Mis Clases';
    if (url.includes('settings')) return 'Configuración';

    return 'Dashboard';
  });
}
