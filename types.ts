
export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
  subTasks: SubTask[];
  category: string;
  aiInsights?: string;
}

export interface AIAnalysis {
  summary: string;
  criticalTaskIds: string[];
  suggestions: string[];
}
