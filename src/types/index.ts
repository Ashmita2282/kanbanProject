export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  dueDate?: string;
  status: TaskStatus;
  deadline?: string; 
}

export interface Project {
  id: string;
  name: string;
  tasks: Task[];
}
