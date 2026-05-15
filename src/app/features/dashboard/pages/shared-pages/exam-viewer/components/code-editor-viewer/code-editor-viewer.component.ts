import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodeMetaData, Question } from '../../../../../models/RESTExamResponse.interface';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
// import { Question, CodeMetaData } from '../../../path/a/tus/interfaces';

@Component({
  selector: 'code-editor-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorModule],
  templateUrl: './code-editor-viewer.component.html'
})
export class CodeEditorViewerComponent {
  question = input.required<Question>(); // Usamos any aquí para evitar el choque estricto en el input general
  isPreviewMode = input<boolean>(false);
  answerChange = output<string>();

  code = signal<string>('');
  outputConsole = signal<string>('');
  showOutput = signal<boolean>(false);
  isExecuting = signal<boolean>(false); // Para mostrar un "Cargando..."

  // 👇 ESTA ES LA SOLUCIÓN AL ERROR DE METADATA
  // Creamos una señal específica y segura para que el HTML la lea sin quejarse
  codeMeta = computed(() => this.question().metadata as CodeMetaData);

  editorOptions = computed(() => {
    return {
      theme: 'vs-dark',
      language: this.codeMeta()?.language || 'javascript',
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on'
    };
  });

  constructor() {
    effect(() => {
      const meta = this.codeMeta();
      if (meta && meta.starterCode) {
        this.code.set(meta.starterCode);
        this.answerChange.emit(meta.starterCode);
      } else {
        this.code.set('');
      }
    });
  }

  onCodeChange(newCode: string) {
    this.code.set(newCode);
    this.answerChange.emit(newCode);
  }

  handleReset() {
    const initialCode = this.codeMeta()?.starterCode || '';
    this.code.set(initialCode);
    this.answerChange.emit(initialCode);
    this.outputConsole.set('');
    this.showOutput.set(false);
  }

  // 👇 PREPARADO PARA EJECUCIÓN REAL
  handleRun() {
    this.showOutput.set(true);

    if (this.isPreviewMode()) {
      this.outputConsole.set('Modo Vista Previa: El código no se ejecutará.\n(El maestro solo visualiza la estructura).');
      return;
    }

    this.isExecuting.set(true);
    this.outputConsole.set('Ejecutando código en el servidor...\n');

    /* ===============================================================
      AQUÍ VA TU FUTURA CONEXIÓN AL BACKEND PARA COMPILAR CÓDIGO
      ===============================================================
      this.http.post('http://tu-django/api/execute/', {
        language: this.codeMeta().language,
        code: this.code()
      }).subscribe({
        next: (response) => {
          this.outputConsole.set(response.output);
          this.isExecuting.set(false);
        },
        error: (err) => {
          this.outputConsole.set('Error de compilación: ' + err.message);
          this.isExecuting.set(false);
        }
      });
    */

    // Simulación temporal para que no marque error mientras haces el backend
    setTimeout(() => {
      this.outputConsole.set('Simulación exitosa: Hola Mundo!\n(Conecta tu backend para ejecución real).');
      this.isExecuting.set(false);
    }, 1500);
  }

  getSplitRules(text: string | undefined): string[] {
    if (!text) return [];
    return text.split('\n').filter(rule => rule.trim() !== '');
  }
}
