import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionForm } from '../../../../../models/RESTExamResponse.interface';
import { FormUtilsService } from '../../../../../../../shared/utils/form-utils.service';
import { OnlyNumbersDirective } from "../../../../../../../shared/directives/only-numbers.directive";
// Importa tu interfaz global, asegúrate de ajustar la ruta
// import { QuestionForm } from '../models/question.model';

@Component({
  selector: 'app-true-false-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnlyNumbersDirective],
  templateUrl: './true-false-form.component.html'
})
export class TrueFalseFormComponent {

  onAdd = output<QuestionForm>();
  onCancel = output<void>();


  private fb = inject(FormBuilder);
  formUtils = inject(FormUtilsService);


  tfForm: FormGroup = this.fb.group({
    prompt: ['', Validators.required],
    points: [10, [Validators.required, this.formUtils.minValue(1)]],
    metadata: this.fb.group({
      correctAnswer: [true, Validators.required]
    })
  });

  get correctAnswer(): boolean {
    return this.tfForm.get('metadata.correctAnswer')?.value;
  }
  setCorrectAnswer(value: boolean) {
    this.tfForm.get('metadata.correctAnswer')?.setValue(value);
  }

  handleAdd() {
    if (this.tfForm.invalid) {
      this.tfForm.markAllAsTouched();
      return;
    }

    // Extraemos los valores crudos del formulario
    const formValues = this.tfForm.getRawValue();

    // Armamos el JSON final siguiendo la estructura de tu interfaz
    const newQuestion: QuestionForm = {
      question_type: 'TF', // Basado en tu tipado estricto
      prompt: formValues.prompt,
      points: formValues.points,
      order: 0,
      metadata: formValues.metadata,
      options: [] // Lo enviamos vacío porque es un True/False
    };

    this.onAdd.emit(newQuestion);
  }

  cancel() {
    this.onCancel.emit();
  }
}
