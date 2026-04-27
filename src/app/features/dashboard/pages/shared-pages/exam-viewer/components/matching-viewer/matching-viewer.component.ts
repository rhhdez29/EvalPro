import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../../../../models/RESTExamResponse.interface';

// 👇 Ajusta la ruta a tus interfaces reales
// import { Question, MatchMetaData } from '../../../path/a/tus/interfaces';

interface RightItem {
  text: string;
  originalIndex: number;
}

@Component({
  selector: 'matching-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matching-viewer.component.html'
})
export class MatchingViewerComponent {
  question = input.required<Question>(); // O usa Question si ya solucionaste el import
  isPreviewMode = input<boolean>(false);
  answerChange = output<Map<number, number>>();

  // Señal segura para la metadata de matching
  matchMeta = computed(() => this.question().metadata as any); // Cambia "any" por "MatchMetaData" si la tienes

  // Estados
  matches = signal<Map<number, number>>(new Map());
  selectedLeft = signal<number | null>(null);
  rightItems = signal<RightItem[]>([]);

  pairs = computed(() => this.matchMeta()?.pairs || []);

  constructor() {
    effect(() => {
      const p = this.pairs();
      if (p.length > 0) {
        // Inicializar y barajar la columna derecha (Fisher-Yates)
        const items = p.map((pair: any, i: number) => ({ text: pair.right, originalIndex: i }));
        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
        }
        this.rightItems.set(items);
        this.matches.set(new Map());
        this.selectedLeft.set(null);
      }
    }, { allowSignalWrites: true });
  }

  handleLeftClick(leftIndex: number) {
    this.selectedLeft.set(leftIndex);
  }

  handleRightClick(rightIndex: number) {
    const currentSelectedLeft = this.selectedLeft();
    if (currentSelectedLeft !== null) {
      // Clonamos el Map para que Angular detecte el cambio
      const newMatches = new Map(this.matches());

      // Removemos si ya existía para ese lado izquierdo
      newMatches.delete(currentSelectedLeft);

      // Removemos si algún lado izquierdo ya apuntaba a este lado derecho
      for (const [left, right] of newMatches.entries()) {
        if (right === rightIndex) {
          newMatches.delete(left);
        }
      }

      newMatches.set(currentSelectedLeft, rightIndex);
      this.matches.set(newMatches);
      this.selectedLeft.set(null);

      // Emitimos el nuevo mapa al Padre
      this.answerChange.emit(newMatches);
    }
  }

  clearAllMatches() {
    const emptyMap = new Map();
    this.matches.set(emptyMap);
    this.selectedLeft.set(null);
    this.answerChange.emit(emptyMap);
  }

  // Funciones de ayuda para el HTML
  isLeftMatched(index: number): boolean {
    return this.matches().has(index);
  }

  isRightMatched(index: number): boolean {
    return Array.from(this.matches().values()).includes(index);
  }

  getMatchedRightIndex(index: number): number | undefined {
    return this.matches().get(index);
  }

  // Para evitar errores en el template
  getMapEntries() {
    return Array.from(this.matches().entries());
  }

  getChar(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
