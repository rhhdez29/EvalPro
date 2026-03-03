interface user{
  id: number  ;
  email: string;
  firtsName: string;
  lastName: string;
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

export type UserSesion = Teacher | Student;
