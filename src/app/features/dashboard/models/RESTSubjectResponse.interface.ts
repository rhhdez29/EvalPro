export interface RESTSubject {
  id:               number;
  name:             string;
  code:             string;
  color:            string;
  department:       string;
  teacher_name:     string;
  teacher_id?:      number;
  created_by?:      number;
  students_count:   number;
  exams_count:      number;
  has_active_exam?: boolean;
}
