import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';

// Importamos los iconos
import { Code, AlertCircle, LucideAngularModule } from 'lucide-angular';

// Importamos el módulo del editor (asegúrate de tenerlo instalado)
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

// Asumiendo que esta es tu interfaz global
import { QuestionForm, QuestionType } from '../../../../../models/RESTExamResponse.interface';
import { FormUtilsService } from '../../../../../../../shared/utils/form-utils.service';
import { OnlyNumbersDirective } from "../../../../../../../shared/directives/only-numbers.directive";

@Component({
  selector: 'app-code-editor-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    MonacoEditorModule // <-- Necesario para el <ngx-monaco-editor>
    ,
    ReactiveFormsModule,
    OnlyNumbersDirective
],
  templateUrl: './code-editor-builder.component.html'
})
export class CodeEditorBuilderComponent {

  // 1. Outputs
  onAdd = output<QuestionForm>();
  onCancel = output<void>();

  private fb = inject(NonNullableFormBuilder);
  public formUtils = inject(FormUtilsService);

  // 2. Iconos
  readonly icons = { Code, AlertCircle };

  // Formulario
  codeForm = this.fb.group({
    question_type: ['Code' as QuestionType, Validators.required],
    prompt: ['', Validators.required],
    points: [10, [Validators.required, this.formUtils.minValue(1)]],
    order: [0, Validators.required],
    metadata: this.fb.group({
      language: ['typescript', Validators.required],
      framework: ['angular', Validators.required],
      starterCode: ['']
    })
  })



  // 3. Constantes de Datos
  readonly LANGUAGES = [
    { value: 'html', label: 'HTML5' },
    { value: 'css', label: 'CSS3' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'sql', label: 'SQL' },
    { value: 'php', label: 'PHP' },
  ];

  readonly FRAMEWORKS = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'django', label: 'Django' },
    { value: 'laravel', label: 'Laravel' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'ionic', label: 'Ionic' },
    { value: 'flutter', label: 'Flutter' },
    { value: 'none', label: 'None / Vanilla' },
  ];

  editorOptions = computed(() => {
    return {
      theme: 'vs-dark',
      language: this.metadataGroup.get('language')?.value,
      minimap: { enabled: false },
      fontSize: 14,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
    };
  });



  ngOnInit(): void {
    const language = this.metadataGroup.get('language');

    const initialLanguage = language?.value;
    this.metadataGroup.get('starterCode')?.setValue(this.getDefaultStarterCode(initialLanguage));

    this.metadataGroup.get('language')?.valueChanges.subscribe((lang) => {
      this.metadataGroup.get('starterCode')?.setValue(this.getDefaultStarterCode(lang));
    });
  }

  private getDefaultStarterCode(lang: string): string {
    const templates: Record<string, string> = {
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>',
      css: '/* Write your CSS here */\n\n',
      javascript: '// Write your JavaScript code here\nfunction solution() {\n  \n}\n',
      typescript: '// Write your TypeScript code here\nexport class Example{\n  \n}\n',
      python: '# Write your Python code here\ndef solution():\n    pass\n',
      java: 'public class Solution {\n    public static void main(String[] args) {\n        \n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
      sql: '-- Write your SQL query here\nSELECT \n',
      php: '<?php\n// Write your PHP code here\n\n?>',
    };
    return templates[lang] || '';
  }

  get metadataGroup(){
    return this.codeForm.get('metadata') as FormGroup;
  }

  addQuestion(){
    if(this.codeForm.invalid){
      this.codeForm.markAllAsTouched();
      return;
    }

    const questionData = this.codeForm.getRawValue()

    const newQuestion: QuestionForm = {
      question_type: questionData.question_type,
      prompt: questionData.prompt,
      points: questionData.points,
      order: questionData.order,
      metadata: questionData.metadata,
      options: []
    }

    this.onAdd.emit(newQuestion);
  }

  cancel() {
    this.onCancel.emit();
  }
}
