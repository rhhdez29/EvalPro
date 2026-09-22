import { Component, input, output, signal, computed, effect } from '@angular/core';
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
  isGradingMode = input<boolean>(false);
  studentAnswer = input<any>(null);

  // Salida
  answerChange = output<boolean>();

  // Estado local
  selectedAnswer = signal<boolean | null>(null);

  // Deducimos cuál es la respuesta correcta para el Modo Preview
  // Asumiendo que guardas las opciones como "Verdadero" o "True" en tu BD
  correctAnswer = computed<boolean | null>(() => {
    const correctOpt = this.question().metadata?.correctAnswer;
    return correctOpt;
  });

  constructor() {
    effect(() => {
      const ans = this.studentAnswer();
      if (ans && ans.text_response !== undefined && ans.text_response !== null) {
        this.selectedAnswer.set(ans.text_response === 'true');
      }
    }, { allowSignalWrites: true });
  }

  selectAnswer(value: boolean) {
    this.selectedAnswer.set(value);
    this.answerChange.emit(value);
  }
}
