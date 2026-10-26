import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ShieldAlert, Clock, Lock, BarChart3, Mail
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

  // Mapa de colores con soporte para modo oscuro
  readonly colorClasses: Record<string, { bg: string; icon: string }> = {
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'text-yellow-600 dark:text-yellow-400' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400' },
    green:  { bg: 'bg-green-100 dark:bg-green-900/30',  icon: 'text-green-600 dark:text-green-400' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', icon: 'text-orange-600 dark:text-orange-400' },
    red:    { bg: 'bg-red-100 dark:bg-red-900/30',    icon: 'text-red-600 dark:text-red-400' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', icon: 'text-indigo-600 dark:text-indigo-400' },
    cyan:   { bg: 'bg-cyan-100 dark:bg-cyan-900/30',   icon: 'text-cyan-600 dark:text-cyan-400' }
  };

  // Datos de las características reales de EvalPro
  readonly features: Feature[] = [
    {
      icon: ShieldAlert,
      title: 'Sistema Anti-Fraude',
      description: 'Monitoreo en tiempo real de la visibilidad del navegador. Detecta cambios de pestaña, pérdida de enfoque y previene recargas accidentales para asegurar evaluaciones justas.',
      color: 'red'
    },
    {
      icon: Clock,
      title: 'Sincronización Precisa',
      description: 'Temporizadores de examen sincronizados con el servidor, envíos automáticos seguros y un margen de tolerancia estricto (20s) para problemas de red.',
      color: 'yellow'
    },
    {
      icon: Lock,
      title: 'Control de Accesos y Roles (RBAC)',
      description: 'Arquitectura segura con separación de roles (Administrador, Profesor, Alumno). Los profesores mantienen control absoluto (Ownership) sobre sus materias y exámenes.',
      color: 'indigo'
    },
    {
      icon: BarChart3,
      title: 'Estadísticas Dinámicas',
      description: 'Paneles de rendimiento dedicados. Los alumnos pueden ver su progreso histórico, mientras que los profesores analizan promedios globales y tasas de aprobación por materia.',
      color: 'purple'
    },
    {
      icon: Mail,
      title: 'Seguridad desde el Registro',
      description: 'Verificación de cuentas mediante códigos OTP de 6 dígitos enviados por correo, asegurando que solo usuarios institucionales o reales accedan a la plataforma.',
      color: 'green'
    }
  ];

  // Helper para obtener las clases en el HTML de forma segura
  getColors(colorName: string) {
    return this.colorClasses[colorName] || this.colorClasses['yellow'];
  }
}
