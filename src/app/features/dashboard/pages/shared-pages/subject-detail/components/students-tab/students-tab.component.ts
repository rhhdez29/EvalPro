import { Component, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { SubjectService } from '../../../../../services/subject.service';

export interface Student {
  id: string;
  name: string;
  email: string;
  enrollment: string;
  avatar?: string;
}

@Component({
  selector: 'students-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-tab.component.html'
})
export class StudentsTabComponent {
  // Entrada
  subjectId = input.required<string>();

  // Servicio
  subjectService = inject(SubjectService);


  // Estado Local (Signals)
  uploadedFile = signal<File | null>(null);
  isDragging = signal<boolean>(false);
  searchQuery = signal<string>('');

  // Datos simulados (Aquí luego conectarías tu servicio HTTP para traer los reales)
  students = rxResource({
    params: () => this.subjectId(),
    stream: () => this.subjectService.getStudentsBySubject(this.subjectId())
  })

  // Filtrado reactivo: Se recalcula automáticamente si cambia searchQuery o students
  filteredStudents = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.students.value();

    return this.students.value()?.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.date_enrolled.toLowerCase().includes(query)
    );
  });

  // --- Funciones para arrastrar y soltar archivos ---

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.uploadedFile.set(event.dataTransfer.files[0]);
    }
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile.set(input.files[0]);
    }
  }

  // --- Acciones ---

  handleUpload() {
    const file = this.uploadedFile();
    if (file) {
      console.log('Procesando archivo:', file.name);
      // TODO: Mandar el archivo a Django para extraer estudiantes

      // Limpiamos el archivo después de procesar
      this.uploadedFile.set(null);
    }
  }

  removeUploadedFile() {
    this.uploadedFile.set(null);
  }

  updateSearchQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  removeStudent(studentId: string) {
    // TODO: Llamar al backend para eliminarlo de la materia
    console.log (this.students.value())
  }
}
