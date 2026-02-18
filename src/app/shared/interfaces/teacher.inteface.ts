export interface TeacherData {
  rol: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  id_teacher: string;
  faculty: string;
}

export interface TeacherErrors {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  password: string | null;
  id_teacher: string | null;
  faculty: string | null;
}
