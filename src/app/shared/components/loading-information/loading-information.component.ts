import { Component, computed, input } from '@angular/core';
import { AlertCircle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'loading-information',
  imports: [LucideAngularModule],
  templateUrl: './loading-information.component.html',
})
export class LoadingInformationComponent {

  isLoading = input<boolean>(true);
  error = input<Error | undefined>(undefined);
  hasValue = input<boolean>(false);
  emptyMessage = input<string>('No se encontro informacion.')

  defaultErrorMsg = 'Ocurrio un problema al obtenner la informacion.'

  readonly icons = { AlertCircle}

  constructor(){
  }

}
