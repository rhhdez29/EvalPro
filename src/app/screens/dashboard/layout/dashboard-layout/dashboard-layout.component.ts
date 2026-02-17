import { Component, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { LucideAngularModule, Bell } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { SidebarComponent } from '../../../../partials/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, LucideAngularModule],
  templateUrl: './dashboard-layout.component.html'
})
export class DashboardLayoutComponent {
  readonly icons = { Bell };
  private router = inject(Router);

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

    if (url.startsWith('/app/subjects/')) return 'Subject Details';
    if (url.includes('validation')) return 'Teacher Validation';
    if (url.includes('subjects')) return 'Subject Management';
    if (url.includes('users')) return 'Users';
    if (url.includes('my-subjects')) return 'My Subjects';
    if (url.includes('my-classes')) return 'My Classes';
    if (url.includes('settings')) return 'Settings';

    return 'Dashboard';
  });
}
