import { Teacher } from "../../../core/models/user.inteface";

export interface TeacherRegister extends Omit<Teacher, 'id' | 'token'>{
  password: string;
}
