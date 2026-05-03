import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskDto, UpdateTaskDto, FilterType } from '../types';
import { TaskService } from '../services/api';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (taskData: CreateTaskDto) => Promise<void>;
  updateTask: (id: string, updates: UpdateTaskDto) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const useTasks = (filter: FilterType = 'all'): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const fetchedTasks = await TaskService.getAllTasks(filter);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Create a new task
  const createTask = useCallback(async (taskData: CreateTaskDto) => {
    try {
      setError(null);
      const newTask = await TaskService.createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
    } catch (err) {
      console.error('Error creating task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Update a task
  const updateTask = useCallback(async (id: string, updates: UpdateTaskDto) => {
    try {
      setError(null);
      const updatedTask = await TaskService.updateTask(id, updates);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? updatedTask : task
        )
      );
    } catch (err) {
      console.error('Error updating task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id: string) => {
    try {
      setError(null);
      await TaskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Refresh tasks
  const refreshTasks = useCallback(async () => {
    setLoading(true);
    await fetchTasks();
  }, [fetchTasks]);

  // Initial fetch and refetch when filter changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
  };
};

export default useTasks;