import { Component, computed, inject, input, signal, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from '../../../../../core/services/facade.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { SubjectService } from '../../../services/subject.service';
import { ExamsTabComponent } from "./components/exams-tab/exams-tab.component";
// Importa aquí tus componentes de pestañas

// Definimos la interfaz de la pestaña para TypeScript
interface Tab {
  id: string;
  label: string;
  icon: string; // Usaremos el nombre del icono
}

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [
    ExamsTabComponent
],
  templateUrl: './subject-detail.component.html'
})
export class SubjectDetailComponent {
  private router = inject(Router);
  public facade = inject(FacadeService);
  private subjectService = inject(SubjectService);

  //Recibimos el :id de la URL automáticamente como Señal
  id = input.required<string>();

  // 🌟 2. Estado de la pestaña activa (Usamos el ID en lugar del índice numérico, es más seguro)
  activeTabId = signal<string>('');

  subject = rxResource({
    params: () => this.id(),
    stream: () => this.subjectService.getSubjectById(this.id()),
  })

  // 🌟 4. Pestañas dinámicas basadas en el rol usando computed()
  tabs = computed<Tab[]>(() => {
    const role = this.facade.userRole();

    if (role === 'admin' || role === 'maestro') {
      return [
        { id: 'exams', label: 'Exams', icon: 'file-text' },
        { id: 'students', label: 'Students', icon: 'users' },
        { id: 'results', label: 'Results', icon: 'bar-chart-3' },
      ];
    } else if (role === 'alumno') {
      return [
        { id: 'pending', label: 'Pending Exams', icon: 'clock' },
        { id: 'grades', label: 'My Grades', icon: 'check-circle' },
      ];
    }
    return [];
  });

  constructor() {
    // Efecto para seleccionar la primera pestaña por defecto cuando se carguen
    effect(() => {
      const currentTabs = this.tabs();
      if (currentTabs.length > 0 && !this.activeTabId()) {
        this.activeTabId.set(currentTabs[0].id);
      }
    });
  }

  // 🌟 5. Navegación de regreso
  handleBack() {
    const role = this.facade.userRole();
    if (role === 'maestro') {
      this.router.navigate(['home/teacher/subjects']);
    } else if (role === 'alumno') {
      this.router.navigate(['/app/my-classes']);
    } else {
      this.router.navigate(['/app/subject-management']);
    }
  }

  // Función para cambiar de pestaña desde el HTML
  setActiveTab(tabId: string) {
    this.activeTabId.set(tabId);
  }
}
