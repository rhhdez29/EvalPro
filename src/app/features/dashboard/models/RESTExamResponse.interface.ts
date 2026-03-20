//Tipo de pregunta
export type QuestionType = 'MCQ' | 'TF' | 'MATCH' | 'Code';

//Opciones de respuesta
export interface AnswerOption{
  id: number;
  question?: number;
  text: string;
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
  initial_code: string;
}

export type QuestionMetaData = MatchMetaData | CodeMetaData | Record<string, any>;

//Pregunta con sus opciones anidadas
export interface Question{
  id: number;
  exam: number;
  question_type: QuestionType;
  prompt: string;
  points: number | string;
  order: number;
  metadata: QuestionMetaData;
  options: AnswerOption[];
}

//Examen informacion basica
export interface ExamBase{
  id: number;
  subject: number;
  title: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
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

export interface ExamForm extends Omit<ExamDetail, 'id' | 'subject' | 'status'>{

}

export interface QuestionForm extends Omit<Question, 'id' | 'exam'>{

}
