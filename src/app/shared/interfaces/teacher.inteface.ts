export interface TeacherData {
  rol: string;
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  numeroEmpleado: string;
  Facultad: string;
}

export interface TeacherErrors {
  nombre: string | null;
  apellido: string | null;
  correo: string | null;
  password: string | null;
  numeroEmpleado: string | null;
  facultad: string | null;
}
