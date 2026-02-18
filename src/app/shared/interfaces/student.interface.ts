export interface StudentData {
  rol: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  id_student: string;
  career: string;
  semester: string;
  kardex: string;
}

export interface StudentProfileData {
  rol: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  id_student: string;
  career: string;
  semester: string;
  kardex: string;
}

export interface StudentErrors {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  password: string | null;
  id_student: string | null;
  career: string | null;
  semester: string | null;
  kardex: string | null;
}
