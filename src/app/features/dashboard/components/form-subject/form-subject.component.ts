import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X, BookOpen, Check } from 'lucide-angular';
import {  CreateSubjectForm } from '../../models/subject.interface'
import { SubjectService } from '../../services/subject.service';
import { FormUtilsService } from '../../../../shared/utils/form-utils.service';


@Component({
  selector: 'app-create-subject-form',
  standalone: true,
  // ReactiveFormsModule es clave aquí
  imports: [CommonModule, FormsModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './form-subject.component.html'
})
export class FormSubjectComponent {


  private subjectService = inject(SubjectService);
  private fb = inject(NonNullableFormBuilder);
  public formUtils = inject(FormUtilsService);


  // Reemplazamos los props de React por Outputs de Angular
  @Output() closeDialog = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<CreateSubjectForm>();

  touchedFields =signal<Set<string>>(new Set());

  myForm = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    department: ['', Validators.required],
    color: ['bg-blue-500', Validators.required]
  });

  // Mapeo de iconos para el HTML

  readonly icons = { X, BookOpen, Check };

  readonly colorOptions = [
    { value: 'bg-blue-500', label: 'Blue', hex: '#3b82f6' },
    { value: 'bg-purple-500', label: 'Purple', hex: '#a855f7' },
    { value: 'bg-green-500', label: 'Green', hex: '#22c55e' },
    { value: 'bg-red-500', label: 'Red', hex: '#ef4444' },
    { value: 'bg-yellow-500', label: 'Yellow', hex: '#eab308' },
    { value: 'bg-pink-500', label: 'Pink', hex: '#ec4899' },
    { value: 'bg-indigo-500', label: 'Indigo', hex: '#6366f1' },
    { value: 'bg-teal-500', label: 'Teal', hex: '#14b8a6' },
    { value: 'bg-orange-500', label: 'Orange', hex: '#f97316' },
    { value: 'bg-cyan-500', label: 'Cyan', hex: '#06b6d4' },
  ];

  // Métodos

  handleColorSelect(color: string) {
    this.myForm.patchValue({
      color: color
    })
  }

  getFieldValue(field: string) {
    return this.myForm.get(field)?.value;
  }

  onClose() {
    this.closeDialog.emit();
  }
  onSubmit() {

    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.myForm.getRawValue());
    this.myForm.reset();
  }
}
