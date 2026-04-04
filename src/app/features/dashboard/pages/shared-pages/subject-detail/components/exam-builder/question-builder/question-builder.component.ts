import { Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Asumiendo que usas lucide-angular como en el resto de tu app
import { Plus, X, Check, Code, LucideAngularModule } from 'lucide-angular';
import { CodeEditorBuilderComponent } from "../question-builder/question-types/code-editor-builder/code-editor-builder.component";

// Importa aquí tus componentes hijos (asumiendo que ya los pasaste a Angular)
// import { MultipleChoiceBuilderComponent } from './question-types/multiple-choice-builder.component';
// import { TrueFalseBuilderComponent } from './question-types/true-false-builder.component';
// ...

import { Question, QuestionForm, QuestionType } from '../../../../../../models/RESTExamResponse.interface';
import { FormGroup } from '@angular/forms';
import { TrueFalseFormComponent } from "../question-builder/question-types/true-false-form/true-false-form.component";
import { MatchingFormComponent } from "../question-builder/question-types/matching-form/matching-form.component";
import { MultipleChoiceFormComponent } from "../question-builder/question-types/multiple-choice-form/multiple-choice-form.component";


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
  onClose = output<void>();


  // 2. Estado manejado con Signals
  isBuilding = input<boolean>(false);
  selectedType = signal<QuestionType>('MCQ');
  isEditQuestion = signal(false);
  questionToEdit = input<Question | null>(null);


  // 3. Íconos
  readonly icons = { Plus, X, Check, Code };

  constructor(){
    effect(() => {
      const question = this.questionToEdit();
      if(question){
        this.isEditQuestion.set(true);
        this.selectedType.set(question.question_type);

      }
    });
  }
  // 4. Métodos
  handleCancel() {
    this.selectedType.set('MCQ');
    this.onClose.emit();
  }

  handleAdd(question: QuestionForm) {
    this.onAddQuestion.emit(question);
    this.selectedType.set('MCQ');
  }

  selectType(type: QuestionType) {
    this.selectedType.set(type);
  }
}
