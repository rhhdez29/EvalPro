export interface UserList {
  id: number;
  complete_name: string;
  email: string;
  role: 'administrador' | 'maestro' | 'alumno';
  status: boolean; // true = Activo, false = Inactivo
}
