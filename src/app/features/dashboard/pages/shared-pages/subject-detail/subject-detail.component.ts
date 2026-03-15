import { Component, computed, inject, input, signal, OnInit, effect, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { NEVER } from 'rxjs';


import { FacadeService } from '../../../../../core/services/facade.service';
import { SubjectService } from '../../../services/subject.service';

import { ExamsTabComponent } from "./components/exams-tab/exams-tab.component";
import { LoadingInformationComponent } from "../../../../../shared/components/loading-information/loading-information.component";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [
    ExamsTabComponent,
    LoadingInformationComponent
],
  templateUrl: './subject-detail.component.html'
})
export class SubjectDetailComponent {


  //Recibimos el :id de la URL automáticamente como Señal
  id = input.required<string>();

  private router = inject(Router);
  public facade = inject(FacadeService);
  private subjectService = inject(SubjectService);
  private platformId = inject(PLATFORM_ID);

  //Estado de la pestaña activa (Usamos el ID en lugar del índice numérico, es más seguro)
  activeTabId = signal<string>('');


  //Pestañas dinámicas basadas en el rol usando computed()
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

  isSubjectDetailEmpty = computed(() => {
    const data = this.subjectDetailResource.value()

    if(!data || !Array.isArray(data)) return false;

    return data.length === 0;

  })

  subjectDetailResource = rxResource({
    params: () => this.id(),
    stream: ({params}) => {
      if(isPlatformBrowser(this.platformId)){
        return this.subjectService.getSubjectById(params)
      }
      return NEVER
    },
  })

  constructor() {
    // Efecto para seleccionar la primera pestaña por defecto cuando se carguen
    effect(() => {
      const currentTabs = this.tabs();
      if (currentTabs.length > 0 && !this.activeTabId()) {
        this.activeTabId.set(currentTabs[0].id);
      }
    });
  }

  ngAfterNextRender(){
    this.subjectDetailResource.reload();
  }
  //Navegación de regreso
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
