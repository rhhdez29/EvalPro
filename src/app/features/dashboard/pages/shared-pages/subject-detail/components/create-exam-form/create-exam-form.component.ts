import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  X,
  FileText,
  Plus,
  Trash2,
  GripVertical,
  AlertCircle
} from 'lucide-angular';
import { FormUtilsService } from '../../../../../../../shared/utils/form-utils.service';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'matching' | 'code-editor';
  score: number;
  question: string;
  data: any;
}

export interface ExamFormData {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  duration: number; // en minutos
  totalScore: number;
  examType: 'timed' | 'unlimited';
  questions: Question[];
}

@Component({
  selector: 'app-create-exam-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ReactiveFormsModule
],
  templateUrl: './create-exam-form.component.html'
})
export class CreateExamFormComponent {

  // Inputs y Outputs modernos de Angular
  subjectId = input.required<string>();
  closeDialog = output<void>();
  submitForm = output<ExamFormData>();

  private fb = inject(NonNullableFormBuilder);
  public formUtils = inject(FormUtilsService);


  readonly icons = { X, FileText, Plus, Trash2, GripVertical, AlertCircle };

  // --- ESTADOS ---
  currentSection = signal<'metadata' | 'questions'>('metadata');


  // --- FORMULARIO ---
  examForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
    duration: [60, Validators.required],
    total_score: [100, Validators.required],
  })


  formData = signal<ExamFormData>({
    title: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    duration: 60,
    totalScore: 100,
    examType: 'timed',
    questions: []
  });


  touched = signal({
    title: false,
    description: false,
    startDateTime: false,
    endDateTime: false,
  });

  // --- ESTADOS COMPUTADOS (Magia Reactiva) ---

  // 1. Calcula el puntaje total automáticamente basándose en las preguntas agregadas
  calculatedTotalScore = computed(() => {
    return this.formData().questions.reduce((sum, q) => sum + q.score, 0);
  });

  // 2. Motor de validación en tiempo real
  errors = computed(() => {
    const data = this.formData();
    const errs = { title: '', description: '', startDateTime: '', endDateTime: '' };

    if (!data.title.trim()) errs.title = 'Exam title is required';
    if (!data.description.trim()) errs.description = 'Description is required';
    if (!data.startDateTime) errs.startDateTime = 'Start date/time is required';

    if (!data.endDateTime) {
      errs.endDateTime = 'End date/time is required';
    } else if (data.startDateTime && data.endDateTime <= data.startDateTime) {
      errs.endDateTime = 'End date must be after start date';
    }

    return errs;
  });

  // --- MÉTODOS DE UI Y FORMULARIO ---

  updateField(field: keyof ExamFormData, value: any) {
    this.formData.update(current => ({ ...current, [field]: value }));
  }

  setSection(section: 'metadata' | 'questions') {
    this.currentSection.set(section);
  }

  // --- MANEJO DE PREGUNTAS ---

  addQuestion(question: Question) {
    this.formData.update(current => ({
      ...current,
      questions: [...current.questions, question]
    }));
  }

  removeQuestion(index: number) {
    this.formData.update(current => ({
      ...current,
      questions: current.questions.filter((_, i) => i !== index)
    }));
  }

  moveQuestion(index: number, direction: 'up' | 'down') {
    const questions = [...this.formData().questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < questions.length) {
      // Intercambio de elementos en el arreglo
      [questions[index], questions[newIndex]] = [questions[newIndex], questions[index]];
      this.formData.update(current => ({ ...current, questions }));
    }
  }

  // --- ENVÍO DEL FORMULARIO ---

  handleSubmit() {
    // Validar Metadatos primero
    this.touched.set({ title: true, description: true, startDateTime: true, endDateTime: true });

    const currentErrors = this.errors();
    if (currentErrors.title || currentErrors.description || currentErrors.startDateTime || currentErrors.endDateTime) {
      this.currentSection.set('metadata');
      return;
    }

    // Validar que haya preguntas
    if (this.formData().questions.length === 0) {
      alert('Please add at least one question');
      this.currentSection.set('questions');
      return;
    }

    // Emitir el payload completo
    this.submitForm.emit(this.formData());
  }

  onClose() {
    this.closeDialog.emit();

  }
}
