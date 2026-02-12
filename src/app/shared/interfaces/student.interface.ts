export interface StudentData {
  rol: string;
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  matricula: string;
  carrera: string;
  semestre: string;
  kardex: File | null;
}

export interface StudentErrors {
  nombre: string | null;
  apellido: string | null;
  correo: string | null;
  password: string | null;
  matricula: string | null;
  carrera: string | null;
  semestre: string | null;
  kardex: string | null;
}
