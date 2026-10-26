import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, GraduationCap, Sun, Moon } from 'lucide-angular';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent {
  private themeService = inject(ThemeService);

  readonly GraduationCap = GraduationCap;
  readonly Sun = Sun;
  readonly Moon = Moon;

  readonly isDarkMode = this.themeService.isDarkMode;

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
