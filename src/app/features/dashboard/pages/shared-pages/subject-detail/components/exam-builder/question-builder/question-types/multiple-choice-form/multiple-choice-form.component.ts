import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plus, Trash2, AlertCircle, LucideAngularModule } from 'lucide-angular';
import { Question, QuestionForm } from '../../../../../../../../models/RESTExamResponse.interface';
import { FormUtilsService } from '../../../../../../../../../../shared/utils/form-utils.service';
import { OnlyNumbersDirective } from "../../../../../../../../../../shared/directives/only-numbers.directive";

@Component({
  selector: 'app-multiple-choice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, OnlyNumbersDirective],
  templateUrl: './multiple-choice-form.component.html'
})
export class MultipleChoiceFormComponent {
  private fb = inject(FormBuilder);
  readonly icons = { Plus, Trash2, AlertCircle };
  formUtils = inject(FormUtilsService);

  questionToEdit = input<Question | null>(null);
  isEditing = signal<boolean>(false);


  // 1. Outputs
  onAdd = output<any>(); // Cambia 'any' por tu interfaz 'QuestionForm'
  onCancel = output<void>();

  // 2. Formulario Principal
  mcqForm: FormGroup = this.fb.group({
    prompt: ['', Validators.required],
    points: [10, [Validators.required, this.formUtils.minValue(1)]],
    options: this.fb.array([
      this.createOption(),
      this.createOption()
    ], Validators.minLength(2))
  });

  constructor(){

    effect(() => {
    const question = this.questionToEdit();
    console.log(question);
    if(question){
      this.isEditing.set(true);
      this.mcqForm.patchValue({
        prompt: question.prompt,
        points: question.points
      });

      this.optionsArray.clear();
      question.options.forEach((option: any) => {
        this.optionsArray.push(this.createOption());
      });
    }
  });

  }

  // 3. Getter para el FormArray
  get optionsArray(): FormArray {
    return this.mcqForm.get('options') as FormArray;
  }

  // 4. Getter para calcular la suma de puntos parciales en tiempo real
  get totalPartialScore(): number {
    return this.optionsArray.controls
      .filter(ctrl => ctrl.get('isCorrect')?.value === true)
      .reduce((sum, ctrl) => sum + (Number(ctrl.get('partialScore')?.value) || 0), 0);
  }

  // 5. Métodos del FormArray
  private createOption(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      isCorrect: [false],
      partialScore: [0, Validators.min(0)]
    });
  }

  addOption() {
    this.optionsArray.push(this.createOption());
  }

  removeOption(index: number) {
    if (this.optionsArray.length > 2) {
      this.optionsArray.removeAt(index);
    }
  }

  // 6. Lógica de negocio al marcar/desmarcar "Correcto"
  onCorrectChange(index: number) {
    const optionGroup = this.optionsArray.at(index) as FormGroup;
    const isCorrect = optionGroup.get('isCorrect')?.value;
    const totalScore = this.mcqForm.get('points')?.value || 0;

    if (isCorrect) {
      // Si la marcó correcta y no tiene puntos, le asigna el total de la pregunta por defecto
      const currentPartial = optionGroup.get('partialScore')?.value;
      if (!currentPartial) {
        optionGroup.get('partialScore')?.setValue(totalScore);
      }
    } else {
      // Si la desmarca, sus puntos parciales vuelven a cero
      optionGroup.get('partialScore')?.setValue(0);
    }
  }

  // 7. Guardado y Validación final
  handleAdd() {
    if (this.mcqForm.invalid) {
      this.mcqForm.markAllAsTouched();
      return;
    }

    const formValues = this.mcqForm.getRawValue();

    // Validación 1: Al menos una correcta
    const hasCorrectAnswer = formValues.options.some((o: any) => o.isCorrect);
    if (!hasCorrectAnswer) {
      alert('Please mark at least one correct answer.');
      return;
    }

    // Validación 2: Los puntos parciales deben sumar el total
    const totalScore = formValues.points;
    if (Math.abs(this.totalPartialScore - totalScore) > 0.01) {
      alert(`Partial scores must sum to total score (${totalScore}). Current sum: ${this.totalPartialScore}`);
      return;
    }

    // Armamos el JSON final
    const newQuestion: QuestionForm = {
      question_type: 'MCQ',
      prompt: formValues.prompt,
      points: formValues.points,
      order: 0,
      metadata: {},
      options: formValues.options
    };

    this.onAdd.emit(newQuestion);
  }

  cancel() {
    this.onCancel.emit();
  }
}
