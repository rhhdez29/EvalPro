import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  // Estado Local (Signals)
  uploadedFile = signal<File | null>(null);
  isDragging = signal<boolean>(false);
  searchQuery = signal<string>('');

  // Datos simulados (Aquí luego conectarías tu servicio HTTP para traer los reales)
  students = signal<Student[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@university.edu',
      enrollment: 'STU-2024-001',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@university.edu',
      enrollment: 'STU-2024-002',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.j@university.edu',
      enrollment: 'STU-2024-003',
    },
  ]);

  // Filtrado reactivo: Se recalcula automáticamente si cambia searchQuery o students
  filteredStudents = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.students();

    return this.students().filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.enrollment.toLowerCase().includes(query)
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
    this.students.update(current => current.filter(s => s.id !== studentId));
  }
}
