import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LucideAngularModule, GraduationCap, ChevronLeft } from 'lucide-angular';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, LucideAngularModule],
  templateUrl: './auth-layout.component.html',
  styles: ``
})
export class AuthLayoutComponent implements OnInit {

  // Signal para saber si estamos en Login
  isLoginTab = signal(true);

  readonly GraduationCap = GraduationCap;
  readonly ChevronLeft = ChevronLeft;

  constructor(private router: Router) {}

  ngOnInit() {
    // Escuchamos la URL para mover el switch automáticamente
    // Si la URL tiene '/login', isLoginTab = true. Si no (es register), false.
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTabState();
    });

    // Ejecutar al inicio por si recargan la página
    this.updateTabState();
  }

  private updateTabState() {
    this.isLoginTab.set(this.router.url.includes('/login'));
  }
}
