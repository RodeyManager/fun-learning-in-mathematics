
export enum AppView {
  HOME = 'HOME',
  ARITHMETIC = 'ARITHMETIC',
  GEOMETRY = 'GEOMETRY',
  FRACTIONS = 'FRACTIONS',
  WORD_PROBLEMS = 'WORD_PROBLEMS',
  AI_TUTOR = 'AI_TUTOR',
  JUNIOR_MATH = 'JUNIOR_MATH',
  HIGH_SCHOOL_MATH = 'HIGH_SCHOOL_MATH'
}

export interface Topic {
  id: AppView;
  title: string;
  description: string;
  color: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ShapeData {
  type: 'rectangle' | 'square' | 'triangle' | 'parallelogram' | 'circle' | 'pythagorean' | 'cylinder' | 'cone';
  width: number;
  height: number;
  radius?: number;
}