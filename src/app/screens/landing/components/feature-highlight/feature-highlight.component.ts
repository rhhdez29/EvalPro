import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Shield, CheckCircle, Clock, Users } from 'lucide-angular';

@Component({
  selector: 'app-feature-highlight',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './feature-highlight.component.html',
  styles: ``
})
export class FeatureHighlightComponent {
  // Exponemos los iconos para usarlos en el HTML
  readonly Shield = Shield;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly Users = Users;
}
