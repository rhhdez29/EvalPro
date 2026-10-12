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

  // Signals para saber qué vista está activa
  isLoginTab = signal(true);
  isVerifyTab = signal(false);

  readonly GraduationCap = GraduationCap;
  readonly ChevronLeft = ChevronLeft;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTabState();
    });

    this.updateTabState();
  }

  private updateTabState() {
    this.isLoginTab.set(this.router.url.includes('/login'));
    this.isVerifyTab.set(this.router.url.includes('/verify-email'));
  }
}
