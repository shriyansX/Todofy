export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: string;
  tags: string[];
  subtasks: Subtask[];
  isStarred: boolean;
  estimatedTime?: number; // in minutes
  completedAt?: string;
  isOverdue: boolean;
  subtaskProgress?: {
    completed: number;
    total: number;
    percentage: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: 'pending' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  dueDate?: string;
  tags?: string[];
  isStarred?: boolean;
  estimatedTime?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  dueDate?: string;
  tags?: string[];
  subtasks?: Subtask[];
  isStarred?: boolean;
  estimatedTime?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
  errors?: string[];
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

export type FilterType = 'all' | 'pending' | 'completed' | 'overdue' | 'starred' | 'today';
export type SortType = 'dueDate' | 'priority' | 'created' | 'alphabetical';
export type ViewType = 'list' | 'kanban' | 'calendar';

export interface AppSettings {
  darkMode: boolean;
  username: string;
  currentFilter: FilterType;
  sortBy: SortType;
  viewType: ViewType;
  defaultCategory: string;
  showCompletedTasks: boolean;
  enableNotifications: boolean;
}
