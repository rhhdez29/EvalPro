import { Component, input, output, signal, computed, inject, effect } from '@angular/core';
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
  Edit
} from 'lucide-angular';

import { FormUtilsService } from '../../../../../../../../shared/utils/form-utils.service';
import { ExamDetail, ExamForm, Question, QuestionForm, QuestionType } from '../../../../../../models/RESTExamResponse.interface';
import { QuestionBuilderComponent } from "../question-builder/question-builder.component";
import { OnlyNumbersDirective } from "../../../../../../../../shared/directives/only-numbers.directive";
import { ExamService } from '../../../../../../services/exam.service';

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
  submitForm = output<ExamDetail>();
  examData = input<ExamDetail | null>(null);
  isEditExam = input<boolean>(false);
  questionToEdit = signal<Question | null>(null);
  openQuestionBuilder = signal<boolean>(false);


  private fb = inject(NonNullableFormBuilder);
  public formUtils = inject(FormUtilsService);
  private examService = inject(ExamService);


  readonly icons = { X, FileText, Plus, Trash2, GripVertical, AlertCircle, MoveUp, Edit };

  editIndex = signal<number | null>(null);

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

  constructor(){
    effect(() => {
      const examData = this.examData();
      if(examData){
        this.examForm.patchValue({
          title: examData.title,
          description: examData.description,
          start_date: examData.start_date,
          end_date: examData.end_date,
          duration_minutes: examData.duration_minutes,
          total_score: examData.total_score,
          questions: examData.questions as Question[]
        });

        this.questionsFormArray.clear();

        if(examData.questions && examData.questions.length > 0){
          examData.questions.forEach((question: any) => {
            try {
              this.questionsFormArray.push(this.rebuildQuestionControl(question));
            } catch (error) {
              console.error('Error procesando pregunta:', question, error);
            }
          })
        }

      }
    })
  }

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

  addQuestion(question: QuestionForm | Question){

    if(this.editIndex() !== null){
      this.updateQuestion(question as Question);
      return;
    }

    question.order = this.questionsFormArray.length + 1;

    const quesionControl = this.fb.control(question);

    this.questionsFormArray.push(quesionControl);

    this.openQuestionBuilder.set(false);

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

  private rebuildQuestionControl(q: any){
    let parsedMetadata = q.metadata;
    if (typeof parsedMetadata === 'string') {
      try { parsedMetadata = JSON.parse(parsedMetadata); } catch(e) { parsedMetadata = {}; }
    }
    if (!parsedMetadata || typeof parsedMetadata !== 'object' || Array.isArray(parsedMetadata)) {
      parsedMetadata = {};
    }

    let metadataControl: any;
    if (q.question_type === 'MATCH') {
      const pairsFormArray: FormArray<any> = this.fb.array([] as any[]);
      if (parsedMetadata.pairs && Array.isArray(parsedMetadata.pairs)) {
        parsedMetadata.pairs.forEach((p: any) => {
          pairsFormArray.push(this.fb.group({
            left: [p.left],
            right: [p.right]
          }));
        });
      }
      metadataControl = this.fb.group({ pairs: pairsFormArray });
    } else {
      metadataControl = this.fb.group(parsedMetadata);
    }

    const questionGroup = this.fb.group({
      id: [q.id],
      question_type: [q.question_type],
      prompt: [q.prompt],
      points: [q.points],
      order: [q.order],
      metadata: metadataControl,
      options: this.fb.array([])
    })

    if(q.options && q.options.length > 0){
      const optionsArray = questionGroup.get('options') as FormArray;
      q.options.forEach((option: any) => {
        optionsArray.push(this.fb.group({
          id: [option.id],
          text: [option.text],
          is_correct: [option.is_correct],
          partial_points: [option.partial_points || 0]
        }))
      })
    }

    return questionGroup;
  }

  editQuestion(index: number, question: Question){
    this.editIndex.set(index);
    this.questionToEdit.set(question);
    this.openQuestionBuilder.set(true);
  }

  updateQuestion(editedQuestion: Question){

    const newQuestionGroup = this.rebuildQuestionControl(editedQuestion);

    if(this.editIndex !== null){
      this.questionsFormArray.setControl(this.editIndex()!, newQuestionGroup);
    }

    this.editIndex.set(null);
    this.questionToEdit.set(null);
    this.openQuestionBuilder.set(false);

  }

  closeQuestionBuilder(){
    this.openQuestionBuilder.set(false);
    this.questionToEdit.set(null);
  }

}

