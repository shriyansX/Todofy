import React from 'react';
import { ListTodo, CheckCircle, Clock, Filter, Star, AlertTriangle, CalendarDays, ArrowUpDown } from 'lucide-react';
import { Task, FilterType, UpdateTaskDto, SortType } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onUpdateTask: (id: string, updates: UpdateTaskDto) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  loading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  currentFilter,
  onFilterChange,
  onUpdateTask,
  onDeleteTask,
  loading,
}) => {
  const [sortBy, setSortBy] = React.useState<SortType>('created');

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const starredTasks = tasks.filter(task => task.isStarred);
  const overdueTasks = tasks.filter(task => task.isOverdue && task.status === 'pending');

  const filterOptions = [
    { key: 'all' as FilterType, label: 'All', icon: ListTodo, color: 'text-blue-500' },
    { key: 'pending' as FilterType, label: 'Active', icon: Clock, color: 'text-amber-500' },
    { key: 'completed' as FilterType, label: 'Done', icon: CheckCircle, color: 'text-green-500' },
    { key: 'starred' as FilterType, label: 'Starred', icon: Star, color: 'text-yellow-500' },
    { key: 'overdue' as FilterType, label: 'Overdue', icon: AlertTriangle, color: 'text-red-500' },
    { key: 'today' as FilterType, label: 'Today', icon: CalendarDays, color: 'text-purple-500' },
  ];

  const sortOptions: { key: SortType; label: string }[] = [
    { key: 'created', label: 'Newest First' },
    { key: 'priority', label: 'Priority' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'alphabetical', label: 'A-Z' },
  ];

  const getSortedTasks = (tasksToSort: Task[]) => {
    const sorted = [...tasksToSort];
    switch (sortBy) {
      case 'priority':
        const priorityMap = { urgent: 0, high: 1, medium: 2, low: 3 };
        return sorted.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);
      case 'dueDate':
        return sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      case 'alphabetical':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted; // Default is -createdAt (handled by backend or initial state)
    }
  };

  const sortedTasks = getSortedTasks(tasks);

  const getEmptyStateMessage = () => {
    switch (currentFilter) {
      case 'completed':
        return { title: "No completed tasks", message: "Finish some tasks to see them here!", emoji: "🎯" };
      case 'pending':
        return { title: "All caught up!", message: "No active tasks. Time to relax or add more!", emoji: "✨" };
      case 'starred':
        return { title: "No starred tasks", message: "Star important tasks to find them easily.", emoji: "⭐" };
      case 'overdue':
        return { title: "Nothing overdue", message: "Great job keeping up with your deadlines!", emoji: "🎉" };
      case 'today':
        return { title: "Free day!", message: "No tasks due today. Enjoy your time!", emoji: "🏖️" };
      default:
        return { title: "No tasks yet", message: "Create your first task to get started!", emoji: "🚀" };
    }
  };

  const emptyState = getEmptyStateMessage();

  return (
    <div className="space-y-6">
      {/* Header with Filters & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Scrollable Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {filterOptions.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap
                transition-all duration-300 border-2
                ${currentFilter === key
                  ? 'bg-white dark:bg-gray-800 border-blue-500 text-blue-600 dark:text-blue-400 shadow-md scale-105'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${currentFilter === key ? color : ''}`} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 self-end">
          <div className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <ArrowUpDown className="w-4 h-4 text-gray-400 mr-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="text-xs font-bold bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task Stats Card */}
      {tasks.length > 0 && (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <ListTodo size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Your Progress</h4>
                <p className="text-2xl font-black">
                  {completedTasks.length} / {tasks.length} <span className="text-sm font-normal text-blue-200 ml-2">Tasks Done</span>
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 text-2xl font-black">
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </div>
            </div>

            <div className="w-full bg-black/20 rounded-full h-3 mb-6">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-tighter">Active</p>
                <p className="text-xl font-bold">{pendingTasks.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-tighter">Starred</p>
                <p className="text-xl font-bold">{starredTasks.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-tighter">Overdue</p>
                <p className="text-xl font-bold text-red-300">{overdueTasks.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task List Container */}
      <div className="space-y-4">
        {loading ? (
          // Loading Skeleton
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="animate-pulse flex space-x-3">
                  <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-5 w-5"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedTasks.length > 0 ? (
          // Tasks List
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                loading={loading}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{emptyState.emoji}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {emptyState.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
              {emptyState.message}
            </p>
            
            {currentFilter !== 'all' && tasks.length > 0 && (
              <button
                onClick={() => onFilterChange('all')}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium
                         text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300
                         bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30
                         border border-blue-200 dark:border-blue-800 rounded-md
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ListTodo className="w-4 h-4 mr-2" />
                View All Tasks
              </button>
            )}
          </div>
        )}
      </div>

      {/* Task Actions Hint */}
      {sortedTasks.length > 0 && (
        <div className="text-xs text-center text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-700">
          💡 <strong>Tip:</strong> Click the circle to mark complete, or click a task to expand details
        </div>
      )}
    </div>
  );
};

export default TaskList;