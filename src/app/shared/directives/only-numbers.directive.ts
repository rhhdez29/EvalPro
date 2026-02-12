import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

 // Lista de teclas permitidas que NO son números
  // Backspace: Borrar
  // Tab: Cambiar de campo
  // End, Home, ArrowLeft, ArrowRight: Navegar dentro del input
  // Delete: Suprimir
  private readonly specialKeys = [
    'Backspace', 'Tab', 'End', 'Home',
    'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'
  ];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // 1. Si es una tecla especial, dejarla pasar
    if (this.specialKeys.includes(event.key)) {
      return;
    }

    // 2. Si es combinación de teclas (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X), dejar pasar
    // Esto es importante para buena UX
    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }

    // 3. Regex: Verifica si la tecla presionada es un número (0-9)
    // Si NO es número, prevenir la escritura
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
