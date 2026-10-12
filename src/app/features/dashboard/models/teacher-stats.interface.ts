export interface TeacherSubjectAverage {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  color: string;
  total_exams: number;
  total_attempts: number;
  average: number;
}

export interface TeacherPerformanceStatsResponse {
  global_average: number;
  total_passed: number;
  total_failed: number;
  total_attempts: number;
  pass_rate: number;
  subject_averages: TeacherSubjectAverage[];
}
