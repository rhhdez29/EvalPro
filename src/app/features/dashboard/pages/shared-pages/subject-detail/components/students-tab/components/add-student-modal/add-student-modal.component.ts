import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentListBySubject } from '../../../../../../../models/student-list-by-subject';
import { StudentService } from '../../../../../../../services/student.service';
// Importa tu interfaz Student si la tienes en un archivo compartido
// import { Student } from '../../../../shared/interfaces/student.interface';

@Component({
  selector: 'add-student-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-student-modal.component.html'
})
export class AddStudentModalComponent {
  // Salidas para comunicarnos con el componente Padre (StudentsTab)
  closeModal = output<void>();
  studentAdded = output<any>(); // Emitimos el estudiante encontrado para que el padre lo agregue
  isModalOpen = input<boolean>(false);

  // Servicio
  studentService = inject(StudentService);
  // Estado Local
  searchEmail = signal<string>('');
  isSearching = signal<boolean>(false);
  searchError = signal<string | null>(null);

  // Guardará al estudiante si la búsqueda es exitosa
  foundStudent = signal<StudentListBySubject | null>(null);

  searchStudent() {
    const email = this.searchEmail().trim();
    if (!email) return;

    this.isSearching.set(true);
    this.searchError.set(null);
    this.foundStudent.set(null);

    this.studentService.searchStudentByEmail(email).subscribe({
      next: (student) => {
        this.foundStudent.set(student);
        this.isSearching.set(false);
      },
      error: (error: any) => {
        this.searchError.set(error.message);
        this.isSearching.set(false);
      }
    });
  }

  onAddStudent() {
    const student = this.foundStudent();
    if (student) {
      this.studentAdded.emit(student);
      this.closeModal.emit(); // Cerramos el modal tras agregar
    }
  }
}
