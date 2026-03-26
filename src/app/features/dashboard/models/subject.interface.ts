export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  color: string;

  // Estos campos vienen de solo lectura desde Django
  teacher_name: string;
  students_count: string;
  exams_count: string;

}

export type CreateSubjectForm =Omit<Subject, 'id' | 'created_by' | 'teacher_name' | 'students_count' | 'exams_count'>;

export type EditSubjectForm = Omit<Subject, 'id' | 'created_by' | 'teacher_name' | 'students_count' | 'exams_count'>;
