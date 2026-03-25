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
import { ExamForm, Question, QuestionForm, QuestionType } from '../../../../../models/RESTExamResponse.interface';
import { QuestionBuilderComponent } from "../question-builder/question-builder.component";
import { OnlyNumbersDirective } from "../../../../../../../shared/directives/only-numbers.directive";
import { ExamService } from '../../../../../services/exam.service';

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
    QuestionBuilderComponent,
    OnlyNumbersDirective
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
  private examService = inject(ExamService);


  readonly icons = { X, FileText, Plus, Trash2, GripVertical, AlertCircle, MoveUp };

  // --- ESTADOS ---
  currentSection = signal<'metadata' | 'questions'>('metadata');


  // --- FORMULARIO ---
  examForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
    duration_minutes: [60, [Validators.required, this.formUtils.minValue(1), this.formUtils.maxValue(120)]],
    total_score: [100, [Validators.required, this.formUtils.minValue(10), this.formUtils.maxValue(100)]],
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
    const examFormValue = this.examForm.getRawValue()
    const dt_start = new Date(examFormValue.start_date);
    const dt_end = new Date(examFormValue.end_date);

    dt_start.setSeconds(0,0);
    dt_end.setSeconds(0,0);

    if(this.examForm.invalid){
      this.examForm.markAllAsTouched();
      return;
    }

    if(this.questionsFormArray.length === 0){
      alert('Debe agregar al menos una pregunta');
      return;
    }

    const examData: ExamForm = {
      subject: this.subjectId(),
      title: examFormValue.title,
      description: examFormValue.description,
      start_date: this.toIsoWithOffset(dt_start),
      end_date: this.toIsoWithOffset(dt_end),
      duration_minutes: examFormValue.duration_minutes,
      total_score: examFormValue.total_score,
      questions: examFormValue.questions as Question[]

    }

    this.examService.createExam(examData).subscribe({
      next: (response) => {
        console.log('Examen creado exitosamente: ', response);
        this.closeDialog.emit();
      },
      error: (error) => {
        console.error('Error al crear el examen: ', error);
      }
    })


  }

  toIsoWithOffset(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');

  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const ss = pad(d.getSeconds());

  const offsetMin = -d.getTimezoneOffset(); // -360 => -06:00
  const sign = offsetMin >= 0 ? '+' : '-';
  const offH = pad(Math.floor(Math.abs(offsetMin) / 60));
  const offM = pad(Math.abs(offsetMin) % 60);

  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}${sign}${offH}:${offM}`;
}

}
