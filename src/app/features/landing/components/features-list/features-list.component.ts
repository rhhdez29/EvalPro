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
      title: 'Banco de Preguntas',
      description: 'Crea y gestiona una biblioteca completa de preguntas en todas las materias y niveles de dificultad.',
      color: 'yellow'
    },
    {
      icon: BarChart3,
      title: 'Analíticas e Insights',
      description: 'Análisis de rendimiento detallado para identificar fortalezas, debilidades y áreas de mejora.',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Gestión de Estudiantes',
      description: 'Organiza a los estudiantes por clase, grupo o grupos personalizados con una fácil gestión de inscripciones.',
      color: 'green'
    },
    {
      icon: Calendar,
      title: 'Sistema de Programación',
      description: 'Programa exámenes con anticipación con notificaciones automáticas e integración con el calendario.',
      color: 'orange'
    },
    {
      icon: BookOpen,
      title: 'Calificación Automática',
      description: 'Calificación automatizada instantánea para preguntas objetivas, ahorrando horas de trabajo manual.',
      color: 'red'
    },
    {
      icon: Award,
      title: 'Certificados',
      description: 'Genera y emite certificados digitales automáticamente al completar el examen.',
      color: 'yellow'
    },
    {
      icon: Settings,
      title: 'Personalización',
      description: 'Personaliza la configuración del examen, incluyendo límites de tiempo, aleatorización de preguntas y reglas de puntuación.',
      color: 'indigo'
    },
    {
      icon: Cloud,
      title: 'Almacenamiento en la Nube',
      description: 'Almacenamiento seguro en la nube para todos los datos de exámenes con copias de seguridad automáticas y 99.9% de tiempo de actividad.',
      color: 'cyan'
    }
  ];

  // Helper para obtener las clases en el HTML de forma segura
  getColors(colorName: string) {
    return this.colorClasses[colorName] || this.colorClasses['yellow'];
  }
}
