import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-warning-modal',
  imports: [],
  templateUrl: './warning-modal.component.html',
})
export class WarningModalComponent {

   // 1. Entradas de datos (Inputs dinámicos)
  isOpen = input<boolean>(false);
  title = input<string>('Confirmar eliminación');
  message = input<string>('¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.');

  // Opcional: Para resaltar el nombre exacto de lo que vas a borrar (ej. "Matemáticas I")
  itemName = input<string>('');

  // 2. Salidas (Outputs)
  confirm = output<void>();
  cancel = output<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

}
