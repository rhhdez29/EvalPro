export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  color: string;

  // Estos campos vienen de solo lectura desde Django
  created_by: string;
  teacher_name: string;
  students_count: string;
  students: string[]; // Arreglo de IDs de los alumnos inscritos
}

export interface SubjectErrors{
  name: string | null;
  code: string | null;
  department: string | null;
  color: string | null;
}

export type CreateSubjectForm =Omit<Subject, 'id' | 'created_by' | 'teacher_name' | 'students_count' | 'students'>;

