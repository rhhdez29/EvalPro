
export type QuestionType = 'MCQ' | 'TF' | 'MATCH' | 'CODE';

//Opciones de respuesta
export interface AnswerOption{
  id?: number;
  question?: number;
  text: string;
  partial_score: number;
  is_correct: boolean;
}

//Para las preguntas de unir lineas
export interface MatchMetaData{
  pairs: { left: string; right: string;}[];
}

//Para las preguntas de codigo
export interface CodeMetaData{
  language: string;
  framework: string;
  starterCode: string;
}

export type QuestionMetaData = MatchMetaData | CodeMetaData | Record<string, any>;

//Pregunta con sus opciones anidadas
export interface Question{
  id?: number;
  exam: number;
  question_type: QuestionType;
  prompt: string;
  points: number | string;
  order: number | null;
  metadata: QuestionMetaData;
  options: AnswerOption[];
}

//Examen informacion basica
export interface ExamBase{
  id?: number;
  subject: number | string;
  title: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'scheduled' | 'published' | 'closed';
  duration_minutes: number;
}

//Lista de examenes con cantidad de preguntas
export interface ExamSummary extends ExamBase{
  questions_count: number;
}

//Examen a detalle con preguntas
export interface ExamDetail extends ExamBase{
  total_score: number;
  description: string;
  questions: Question[];
}

export interface ExamForm extends Omit<ExamDetail, 'id' | 'status'>{

}

export interface QuestionForm extends Omit<Question, 'id' | 'exam'>{

}

export interface PendingExams {
  id:        number;
  title:     string;
  dueDate:   string;
  duration:  number; // en minutos
  questions: number;
  status:    'available' | 'in-progress' | 'overdue';
}
export interface ExamDetailStudent {
  id:          number;
  title:       string;
  description: string;
  questions:   Question[];
}

export interface ExamDetailStudent {
  id:          number;
  title:       string;
  description: string;
  questions:   Question[];
}

export interface QuestionStudent{
  id?: number;
  exam: number;
  question_type: QuestionType;
  prompt: string;
  points: number | string;
  order: number | null;
  metadata: QuestionMetaData;
  options: AnswerQuestionStudent[];
}

export interface AnswerQuestionStudent extends Omit<AnswerOption, 'partial_score' | 'is_correct'>{

}
