export interface RESTSubject {
  count:    number;
  next:     null;
  previous: null;
  results:  Result[];
}

export interface Result {
  id:             number;
  name:           string;
  code:           string;
  department:     string;
  color:          string;
  created_by:     number;
  teacher_name:   string;
  students_count: number;
  students:       any[];
}
