import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyLetters]',
  standalone: true
})
export class OnlyLettersDirective {

  // Teclas de navegación que SIEMPRE debemos permitir
  private readonly navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste'
  ];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // 1. Permitir teclas de control (Backspace, Flechas, etc.)
    // Si no hacemos esto, el usuario no podrá borrar si se equivoca.
    if (this.navigationKeys.includes(event.key) ||
       // Permitir atajos como Ctrl+A, Ctrl+C, Ctrl+V
      (event.ctrlKey || event.metaKey)) {
      return; // Dejar pasar
    }

    // 2. Validar solo letras (incluyendo Ñ y tildes) y espacios
    // Si quieres permitir números también, agrega 0-9 dentro de los corchetes
    const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;

    // Si la tecla presionada NO cumple con la regex...
    if (!regex.test(event.key)) {
      // ...bloqueamos la escritura
      event.preventDefault();
    }
  }

}
