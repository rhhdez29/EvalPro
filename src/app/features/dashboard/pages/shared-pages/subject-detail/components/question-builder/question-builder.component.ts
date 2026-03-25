import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Asumiendo que usas lucide-angular como en el resto de tu app
import { Plus, X, Check, Code, LucideAngularModule } from 'lucide-angular';
import { CodeEditorBuilderComponent } from "../code-editor-builder/code-editor-builder.component";

// Importa aquí tus componentes hijos (asumiendo que ya los pasaste a Angular)
// import { MultipleChoiceBuilderComponent } from './question-types/multiple-choice-builder.component';
// import { TrueFalseBuilderComponent } from './question-types/true-false-builder.component';
// ...

import { QuestionForm, QuestionType } from '../../../../../models/RESTExamResponse.interface';
import { FormGroup } from '@angular/forms';
import { TrueFalseFormComponent } from "../true-false-form/true-false-form.component";
import { MatchingFormComponent } from "../matching-form/matching-form.component";
import { MultipleChoiceFormComponent } from "../multiple-choice-form/multiple-choice-form.component";


@Component({
  selector: 'app-question-builder',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    CodeEditorBuilderComponent,
    TrueFalseFormComponent,
    MatchingFormComponent,
    MultipleChoiceFormComponent
],
  templateUrl: './question-builder.component.html'
})
export class QuestionBuilderComponent {

  // 1. Outputs (Reemplaza a los props de funciones en React)
  questionGroup = input<FormGroup>();
  onAddQuestion = output<QuestionForm>();

  // 2. Estado manejado con Signals
  isBuilding = signal(false);
  selectedType = signal<QuestionType>('MCQ');

  // 3. Íconos
  readonly icons = { Plus, X, Check, Code };

  // 4. Métodos
  handleCancel() {
    this.isBuilding.set(false);
    this.selectedType.set('MCQ');
  }

  handleAdd(question: QuestionForm) {
    this.onAddQuestion.emit(question);
    this.isBuilding.set(false);
  }

  selectType(type: QuestionType) {
    this.selectedType.set(type);
  }
}
