import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'true-false-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './true-false-viewer.component.html'
})
export class TrueFalseViewerComponent {
  // Entradas
  question = input.required<any>();
  isPreviewMode = input<boolean>(false);

  // Salida
  answerChange = output<boolean>();

  // Estado local
  selectedAnswer = signal<boolean | null>(null);

  // Deducimos cuál es la respuesta correcta para el Modo Preview
  // Asumiendo que guardas las opciones como "Verdadero" o "True" en tu BD
  correctAnswer = computed<boolean | null>(() => {
    const opts = this.question().options || [];
    const correctOpt = opts.find((o: any) => o.is_correct);

    if (correctOpt) {
      const text = correctOpt.text.toLowerCase();
      return text.includes('true') || text.includes('verdadero') || text === 'v';
    }
    return null; // Por si no lo encuentra
  });

  selectAnswer(value: boolean) {
    this.selectedAnswer.set(value);
    this.answerChange.emit(value);
  }
}
