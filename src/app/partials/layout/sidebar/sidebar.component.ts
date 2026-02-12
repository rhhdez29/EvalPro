import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  LucideAngularModule,
  LayoutDashboard, FileText, BarChart3, Settings,
  GraduationCap, Bell, User, LogOut
} from 'lucide-angular';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,     // Reemplaza a <Outlet />
    RouterLink,       // Reemplaza a <Link>
    RouterLinkActive, // Maneja la clase 'active' automáticamente
    LucideAngularModule
  ],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements OnInit {

  // 1. Definimos los items del menú
  readonly menuItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/exams', label: 'Exams', icon: FileText },
    { path: '/app/results', label: 'Results', icon: BarChart3 },
    { path: '/app/settings', label: 'Settings', icon: Settings },
  ];

  // 2. Exponemos los iconos estáticos para el HTML
  readonly icons = {
    GraduationCap, Bell, User, LogOut
  };

  // 3. Signal para el título dinámico (Reemplaza la lógica de useLocation)
  pageTitle = signal('Dashboard');
  sideBarTitle = signal('EvalPro');

  constructor(private router: Router) {}

  ngOnInit() {
    // Escuchamos cambios en la ruta para actualizar el título del Header
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle();
    });

    // Establecer título inicial al cargar
    this.updateTitle();
  }

  private updateTitle() {
    const currentUrl = this.router.url;
    // Buscamos si la URL actual coincide con algún item del menú
    const activeItem = this.menuItems.find(item => currentUrl.includes(item.path));
    // Si encontramos coincidencia usamos el label, si no, 'Dashboard' por defecto
    this.pageTitle.set(activeItem ? activeItem.label : 'Dashboard');
  }
}
