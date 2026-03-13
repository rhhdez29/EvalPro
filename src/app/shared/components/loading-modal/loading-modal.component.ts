import { Component, input, output } from '@angular/core';

@Component({
  selector: 'loading-modal',
  imports: [],
  templateUrl: './loading-modal.component.html',
})
export class LoadingModalComponent {

  // 1. Recibe el estado actual (obligatorio)
  status = input.required<'oculto' | 'cargando' | 'exito' | 'error'>();

  // 2. Recibe el mensaje de error (opcional, por defecto vacío)
  message1 = input.required<string>();
  message2 = input.required<string>();
}
