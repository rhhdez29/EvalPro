import { Component, input, output, signal, computed, effect } from '@angular/core';
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
  isGradingMode = input<boolean>(false);
  studentAnswer = input<any>(null);

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

  constructor() {
    effect(() => {
      const q = this.question();
      const answer = this.studentAnswer();
      const newSelected = new Set<number>();

      if (answer !== undefined && answer !== null) {
        if (Array.isArray(answer)) {
          answer.forEach((idx: number) => newSelected.add(idx));
        } else if (typeof answer === 'number') {
          newSelected.add(answer);
        } else if (typeof answer === 'object' && answer.selected_option_id !== undefined) {
          const index = this.options().findIndex((o: any) => o.id === answer.selected_option_id);
          if (index !== -1) {
            newSelected.add(index);
          }
        }
      }

      this.selectedOptions.set(newSelected);
    }, { allowSignalWrites: true });
  }

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
