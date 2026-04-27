import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'multiple-choice-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiple-choice-viewer.component.html'
})
export class MultipleChoiceViewerComponent {
  // Entradas
  question = input.required<any>(); // Cambia a <Question> si tienes la interfaz a la mano
  isPreviewMode = input<boolean>(false);

  // Salida (Emitiremos un arreglo con los índices seleccionados)
  answerChange = output<number[]>();

  // Señales calculadas
  options = computed(() => this.question().options || []);

  // Detecta si hay más de una opción correcta para cambiar entre Radio o Checkbox
  hasMultipleCorrect = computed(() => {
    return this.options().filter((opt: any) => opt.is_correct).length > 1;
  });

  // Estado local
  selectedOptions = signal<Set<number>>(new Set());

  toggleOption(index: number) {
    this.selectedOptions.update(currentSet => {
      const newSelected = new Set(currentSet);

      if (this.hasMultipleCorrect()) {
        // Selección múltiple (Checkboxes)
        if (newSelected.has(index)) {
          newSelected.delete(index);
        } else {
          newSelected.add(index);
        }
      } else {
        // Selección única (Radio Buttons)
        newSelected.clear();
        newSelected.add(index);
      }

      // Emitimos el arreglo al Padre (aunque en Preview no lo escuchemos por ahora)
      this.answerChange.emit(Array.from(newSelected));

      return newSelected;
    });
  }

  isSelected(index: number): boolean {
    return this.selectedOptions().has(index);
  }
}
