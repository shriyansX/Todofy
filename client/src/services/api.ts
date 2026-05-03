import axios from 'axios';
import { Task, CreateTaskDto, UpdateTaskDto, ApiResponse, TaskStats, FilterType } from '../types';
import { UserUtils } from '../utils/userUtils';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for logging and adding identification
api.interceptors.request.use(
  (config) => {
    // 1. Add JWT token if exists
    const token = localStorage.getItem('todofy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Add browser fingerprint (fallback/guest identification)
    const userId = UserUtils.getUserId();
    config.headers['x-user-id'] = userId;
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url} [User: ${UserUtils.getUserDisplayId()}]`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }
    throw error;
  }
);

export class TaskService {
  // Get all tasks with optional filtering
  static async getAllTasks(filter: FilterType = 'all'): Promise<Task[]> {
    try {
      const params: any = {};
      
      if (filter === 'completed' || filter === 'pending') {
        params.status = filter;
      } else if (filter === 'starred') {
        params.isStarred = 'true';
      } else if (filter === 'overdue') {
        params.isOverdue = 'true';
      } else if (filter === 'today') {
        params.today = 'true';
      }
      
      const response = await api.get<ApiResponse<Task[]>>('/tasks', { params });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch tasks');
      }
      
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch tasks');
    }
  }

  // Get single task by ID
  static async getTaskById(id: string): Promise<Task> {
    try {
      const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch task');
      }
      
      if (!response.data.data) {
        throw new Error('Task not found');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching task:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch task');
    }
  }

  // Create a new task
  static async createTask(taskData: CreateTaskDto): Promise<Task> {
    try {
      const response = await api.post<ApiResponse<Task>>('/tasks', taskData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create task');
      }
      
      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating task:', error);
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(', '));
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to create task');
    }
  }

  // Update an existing task
  static async updateTask(id: string, updates: UpdateTaskDto): Promise<Task> {
    try {
      const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, updates);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update task');
      }
      
      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating task:', error);
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(', '));
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to update task');
    }
  }

  // Delete a task
  static async deleteTask(id: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse>(`/tasks/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete task');
      }
    } catch (error: any) {
      console.error('Error deleting task:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete task');
    }
  }

  // Get task statistics
  static async getTaskStats(): Promise<TaskStats> {
    try {
      const response = await api.get<ApiResponse<TaskStats>>('/tasks/stats/summary');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch task statistics');
      }
      
      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching task stats:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch task statistics');
    }
  }

  // Toggle task status
  static async toggleTaskStatus(id: string, currentStatus: 'pending' | 'completed'): Promise<Task> {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    return this.updateTask(id, { status: newStatus });
  }
}

export class AuthService {
  static async register(userData: any): Promise<any> {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.token) {
      localStorage.setItem('todofy_token', response.data.token);
    }
    return response.data;
  }

  static async login(credentials: any): Promise<any> {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('todofy_token', response.data.token);
    }
    return response.data;
  }

  static logout() {
    localStorage.removeItem('todofy_token');
  }

  static async getCurrentUser(): Promise<any> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err) {
      return null;
    }
  }
}

// Export the axios instance for direct use if needed
export { api };
export default TaskService;