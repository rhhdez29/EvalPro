import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plus, Trash2, ArrowRight, LucideAngularModule } from 'lucide-angular';
import { FormUtilsService } from '../../../../../../../../../../shared/utils/form-utils.service';
import { Question, QuestionForm } from '../../../../../../../../models/RESTExamResponse.interface';

// import { QuestionForm } from '../models/question.model'; // Ajusta la ruta

@Component({
  selector: 'app-matching-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './matching-form.component.html'
})
export class MatchingFormComponent {
  private fb = inject(FormBuilder);
  formUtils = inject(FormUtilsService);
  readonly icons = { Plus, Trash2, ArrowRight };

  // 1. Outputs
  onAdd = output<QuestionForm>(); // Cambia 'any' por tu 'QuestionForm'
  onCancel = output<void>();
  questionToEdit = input<Question | null>(null);
  isEditing = signal<boolean>(false);

  // 2. Formulario Principal
  matchingForm: FormGroup = this.fb.group({
    prompt: ['', Validators.required],
    points: [10, [Validators.required, this.formUtils.minValue(1)]],
    pairs: this.fb.array([
      this.createPair(),
      this.createPair(),
      this.createPair()
    ], [Validators.required, Validators.minLength(2)]) // Mínimo 2 pares
  });

  constructor(){
    effect(() => {
      const question = this.questionToEdit();
      console.log('editando pregunta: ',question);
      if(question){
        this.isEditing.set(true);
        this.matchingForm.patchValue({
          prompt: question.prompt,
          points: question.points
        });

        let metadata: any = question.metadata;
        if (typeof metadata === 'string') {
          try { metadata = JSON.parse(metadata); } catch(e) { metadata = {}; }
        }
        metadata = metadata || {};

        if (metadata.pairs && Array.isArray(metadata.pairs)) {
          this.pairsArray.clear();
          metadata.pairs.forEach((p: any) => {
            this.pairsArray.push(this.fb.group({
              left: [p.left, Validators.required],
              right: [p.right, Validators.required]
            }));
          });
        }
      }
    });
  }

  // 3. Getter para acceder fácilmente al FormArray en el HTML
  get pairsArray(): FormArray {
    return this.matchingForm.get('pairs') as FormArray;
  }

  // 4. Métodos para manejar el FormArray
  private createPair(): FormGroup {
    return this.fb.group({
      left: ['', Validators.required],
      right: ['', Validators.required]
    });
  }

  addPair() {
    this.pairsArray.push(this.createPair());
  }

  removePair(index: number) {
    if (this.pairsArray.length > 2) {
      this.pairsArray.removeAt(index);
    }
  }

  // 5. Método de guardado
  handleAdd() {
    if (this.matchingForm.invalid) {
      this.matchingForm.markAllAsTouched();
      return;
    }

    if(this.isEditing()){
      const updateQuestion: Question = {
        id: this.questionToEdit()?.id,
        exam: this.questionToEdit()?.exam!,
        question_type: 'MATCH',
        prompt: this.matchingForm.value.prompt,
        points: this.matchingForm.value.points,
        order: this.questionToEdit()?.order!,
        metadata: { pairs: this.matchingForm.getRawValue().pairs },
        options: []
      }
      this.onAdd.emit(updateQuestion);
    }else{
      const formValues = this.matchingForm.getRawValue();
      // Estructuramos el JSON.
      // Guardamos los pares dentro de 'metadata' o donde tu backend lo requiera.
      const newQuestion: QuestionForm = {
        question_type: 'MATCH',
        prompt: formValues.prompt,
        points: formValues.points,
        order: 0,
        metadata: {
          pairs: formValues.pairs
        },
        options: []
      };

      this.onAdd.emit(newQuestion);
    }
  }

  cancel() {
    this.onCancel.emit();
  }
}
