import { user } from "../../../core/models/user.inteface"

export interface StudentListBySubject extends Omit<user, 'token' | 'role' | 'last_name' | 'first_name'>{
  name: string;
  date_enrolled: string;
}
