import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, GraduationCap, Mail, MapPin, Phone } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent {
  // Exponemos los iconos
  readonly GraduationCap = GraduationCap;
  readonly Mail = Mail;
  readonly MapPin = MapPin;
  readonly Phone = Phone;
}
