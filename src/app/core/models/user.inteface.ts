interface user{
  id: number  ;
  email: string;
  first_name: string;
  last_name: string;
  token?: string;
  role: string;
}

export interface Teacher extends user{
  id_teacher: string;
  faculty: string;
}

export interface Student extends user{
  id_student: string;
  career: string;
  semester: string;
  kardex: string;
}

export type UserLoginData = Teacher | Student;

export interface TeacherValidation extends Omit<Teacher, 'first_name' | 'last_name' | 'token'> {
  complete_name: string;
  date_joined: string;
}
