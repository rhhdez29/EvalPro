import { Student } from '../../../core/models/user.inteface';


export interface StudentRegister extends Omit<Student, 'id' | 'token'>{
  password: string;
}


