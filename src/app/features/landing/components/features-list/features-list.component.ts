import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  FileText, BarChart3, Users, Calendar,
  BookOpen, Award, Settings, Cloud
} from 'lucide-angular';

// Definimos una interfaz para tipado estricto (Buenas prácticas)
interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-features-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './features-list.component.html',
  styles: ``
})
export class FeaturesListComponent {

  // Mapa de colores (Igual que en tu React)
  readonly colorClasses: Record<string, { bg: string; icon: string }> = {
    yellow: { bg: 'bg-yellow-100', icon: 'text-yellow-600' },
    purple: { bg: 'bg-purple-100', icon: 'text-purple-600' },
    green:  { bg: 'bg-green-100',  icon: 'text-green-600' },
    orange: { bg: 'bg-orange-100', icon: 'text-orange-600' },
    red:    { bg: 'bg-red-100',    icon: 'text-red-600' },
    indigo: { bg: 'bg-indigo-100', icon: 'text-indigo-600' },
    cyan:   { bg: 'bg-cyan-100',   icon: 'text-cyan-600' }
  };

  // Datos de las características
  readonly features: Feature[] = [
    {
      icon: FileText,
      title: 'Question Bank',
      description: 'Build and manage a comprehensive library of questions across all subjects and difficulty levels.',
      color: 'yellow'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Detailed performance analytics to identify strengths, weaknesses, and improvement areas.',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Student Management',
      description: 'Organize students by class, batch, or custom groups with easy enrollment management.',
      color: 'green'
    },
    {
      icon: Calendar,
      title: 'Scheduling System',
      description: 'Schedule exams in advance with automatic notifications and calendar integration.',
      color: 'orange'
    },
    {
      icon: BookOpen,
      title: 'Auto-Grading',
      description: 'Instant automated grading for objective questions saving hours of manual work.',
      color: 'red'
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Generate and issue digital certificates automatically upon exam completion.',
      color: 'yellow'
    },
    {
      icon: Settings,
      title: 'Customization',
      description: 'Customize exam settings including time limits, question randomization, and scoring rules.',
      color: 'indigo'
    },
    {
      icon: Cloud,
      title: 'Cloud Storage',
      description: 'Secure cloud storage for all exam data with automatic backups and 99.9% uptime.',
      color: 'cyan'
    }
  ];

  // Helper para obtener las clases en el HTML de forma segura
  getColors(colorName: string) {
    return this.colorClasses[colorName] || this.colorClasses['yellow'];
  }
}
