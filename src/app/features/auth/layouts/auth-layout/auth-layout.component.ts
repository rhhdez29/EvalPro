import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LucideAngularModule, GraduationCap, ChevronLeft, Sun, Moon } from 'lucide-angular';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, LucideAngularModule],
  templateUrl: './auth-layout.component.html',
  styles: ``
})
export class AuthLayoutComponent implements OnInit {
  private themeService = inject(ThemeService);

  // Signals para saber qué vista está activa
  isLoginTab = signal(true);
  isVerifyTab = signal(false);

  readonly GraduationCap = GraduationCap;
  readonly ChevronLeft = ChevronLeft;
  readonly Sun = Sun;
  readonly Moon = Moon;

  readonly isDarkMode = this.themeService.isDarkMode;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTabState();
    });

    this.updateTabState();
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  private updateTabState() {
    this.isLoginTab.set(this.router.url.includes('/login'));
    this.isVerifyTab.set(this.router.url.includes('/verify-email'));
  }
}
