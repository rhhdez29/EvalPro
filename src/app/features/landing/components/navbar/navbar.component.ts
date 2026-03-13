import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, GraduationCap } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, LucideAngularModule,],
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent {
  // Exponemos el icono a la vista (HTML)
  readonly GraduationCap = GraduationCap;
}
