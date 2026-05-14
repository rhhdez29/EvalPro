import { Component, computed, input } from '@angular/core';
import { AlertCircle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'loading-information',
  imports: [LucideAngularModule],
  templateUrl: './loading-information.component.html',
})
export class LoadingInformationComponent {

  isLoading = input.required<boolean>();
  error = input<Error | undefined>(undefined);
  data = input.required<any>();
  emptyMessage = input<string>('No se encontro informacion.')

  defaultErrorMsg = 'Ocurrio un problema al obtenner la informacion.'

  hasValue = computed(() => {
    const val = this.data();
    if (!val) return false; // Atrapa null y undefined
    if (Array.isArray(val) && val.length === 0) return false; // Atrapa arreglos vacíos []
    if (typeof val === 'object' && Object.keys(val).length === 0) return false; // Atrapa objetos vacíos {}
    return true; // Si sobrevivió a todo, sí hay datos reales
  });

  isIdle = computed(() => !this.isLoading() && !this.error() && this.data() === undefined);

  readonly icons = { AlertCircle}

  constructor(){
  }

}
