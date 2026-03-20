import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

import {
  LucideAngularModule,
  X,
  FileText,
  Plus,
  Trash2,
  GripVertical,
  AlertCircle,
  MoveUp,
} from 'lucide-angular';

import { FormUtilsService } from '../../../../../../../shared/utils/form-utils.service';
import { ExamForm, QuestionForm, QuestionType } from '../../../../../models/RESTExamResponse.interface';
import { QuestionBuilderComponent } from "../question-builder/question-builder.component";

@Component({
  selector: 'app-create-exam-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    QuestionBuilderComponent
],
  templateUrl: './create-exam-form.component.html'
})
export class CreateExamFormComponent {

  // Inputs y Outputs modernos de Angular
  subjectId = input.required<string>();
  closeDialog = output<void>();
  submitForm = output<ExamForm>();

  private fb = inject(NonNullableFormBuilder);
  public formUtils = inject(FormUtilsService);


  readonly icons = { X, FileText, Plus, Trash2, GripVertical, AlertCircle, MoveUp };

  // --- ESTADOS ---
  currentSection = signal<'metadata' | 'questions'>('metadata');


  // --- FORMULARIO ---
  examForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
    duration_minutes: [60, Validators.required],
    total_score: [100, Validators.required],
    questions: this.fb.array([])
  })



  setSection(section: 'metadata' | 'questions') {
    this.currentSection.set(section);
  }


  moveQuestion(index: number, direction: 'up' | 'down'){
    const questions = this.questionsFormArray;
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < questions.length) {
      // Intercambio de elementos en el arreglo
      const questionToMove = questions.at(index);

      questions.removeAt(index);
      questions.insert(newIndex, questionToMove);
      this.updateQuestionsOrder();

    }
  }

  removeQuestion(index: number){
    this.questionsFormArray.removeAt(index);
    this.updateQuestionsOrder();
  }

  private updateQuestionsOrder() {
    this.questionsFormArray.controls.forEach((control, index) => {

      const question = {...control.value};
      question.order = index + 1;
      control.setValue(question, { emitEvent: false });
    });

  }

  get totalQuestionsScore(){
    return this.questionsFormArray.controls.reduce((sum, control) => sum + control.value.points, 0);
  }

  onClose() {
    this.closeDialog.emit();

  }

  get questionsFormArray() {
    return this.examForm.get('questions') as FormArray;
  }

  getOptionsFormArray(questionIndex: number){
    return this.questionsFormArray.at(questionIndex).get('options') as FormArray;
  }

  addQuestion(question: QuestionForm){
    question.order = this.questionsFormArray.length + 1;

    const quesionControl = this.fb.control(question);

    this.questionsFormArray.push(quesionControl);

    console.log(this.examForm.value);

  }

  setOptionCorrectness(questionIndex: number, optionIndex: number, isCorrect: boolean){
    this.getOptionsFormArray(questionIndex).at(optionIndex).get('is_correct')?.setValue(isCorrect);
  }

  createExam(){
    const examData = this.examForm.getRawValue() as ExamForm;
    console.log('Formulario completo: ', examData);


  }

}
