export interface SubjectStat {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  color: string;
  exams_count: number;
  average_score: number;
}

export interface RecentAttemptStat {
  id: number;
  exam_id: number;
  exam_title: string;
  subject_name: string;
  score: number;
  date: string | null;
  is_passed: boolean;
}

export interface StudentStatsResponse {
  total_exams: number;
  average_score: number;
  passed_exams: number;
  failed_exams: number;
  pass_rate: number;
  by_subject: SubjectStat[];
  recent_attempts: RecentAttemptStat[];
}
