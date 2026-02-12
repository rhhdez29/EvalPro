import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './hero.component.html',
  styles: ``
})
export class HeroComponent {
  // Exponemos el icono para usarlo en el HTML
  readonly ArrowRight = ArrowRight;
}
