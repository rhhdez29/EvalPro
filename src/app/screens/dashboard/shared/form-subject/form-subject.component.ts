import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X, BookOpen, Check } from 'lucide-angular';
import { SubjectErrors, Subject, CreateSubjectForm } from '../../../../shared/interfaces/subject.interface';
import { SubjectService } from '../../../../services/subject.service';


@Component({
  selector: 'app-create-subject-form',
  standalone: true,
  // ReactiveFormsModule es clave aquí
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './form-subject.component.html'
})
export class FormSubjectComponent {


  subjectService = inject(SubjectService);

  // Reemplazamos los props de React por Outputs de Angular
  @Output() closeDialog = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<CreateSubjectForm>();

  touchedFields =signal<Set<string>>(new Set());

  subject = signal<CreateSubjectForm>({
    name: '',
    code: '',
    department: '',
    color: 'bg-blue-500'
  })

  // Mapeo de iconos para el HTML

  readonly icons = { X, BookOpen, Check };
  private fb = inject(FormBuilder);

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

  selectedColor () {
    return this.subject()?.color;
  }

  markAsTouched(field: string) { // Marcar campo como "tocado" para mostrar errores solo después de la interacción
    this.touchedFields.update(set =>
    {
      const newSet = new Set(set);
      newSet.add(field);
      return newSet;
    });
  }

  setData(field: string, value: string) { // Actualizar datos

    this.subject.update(s => ({ ...s, [field]: value }));

  }

  shouldShowError(field: string): boolean {
      const errors = this.SubjectErrors(); // Obtener errores actuales
      const touched = this.touchedFields(); // Obtener campos tocados

      // @ts-ignore (Si usas tipado estricto, indexar por string requiere cuidado)
      return !!errors[field] && touched.has(field);
    }

  SubjectErrors = computed(() => {
    const data = this.subject();
    return this.subjectService.validateSubject(data);
  })

  isFormValid = computed(() => {
    return this.subjectService.isValidForm(this.SubjectErrors());
  });

  handleColorSelect(color: string) {
    this.subject.update(s => ({ ...s, color }));
  }

  onClose() {
    this.closeDialog.emit();
  }
  onSubmit() {
    this.submitForm.emit(this.subject());
  }
}
