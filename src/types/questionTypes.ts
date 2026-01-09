export type QuestionType = "text" | "rating" | "slider" | "choice";

export interface Question {
  id: number;
  title: string;
  type: QuestionType;
  options?: string[];       
  minLabel?: string;
  maxLabel?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
}
