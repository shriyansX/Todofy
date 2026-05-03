import React from 'react';
import { Check, X, Edit2, Trash2, Calendar, Clock, Star, Tag, Hash, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { Task, UpdateTaskDto } from '../types';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: UpdateTaskDto) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete, loading }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(task.title);
  const [editDescription, setEditDescription] = React.useState(task.description || '');
  const [editPriority, setEditPriority] = React.useState(task.priority);
  const [editCategory, setEditCategory] = React.useState(task.category);
  const [editDueDate, setEditDueDate] = React.useState(task.dueDate || '');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const priorityConfig = {
    low: { color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800', label: 'Low' },
    medium: { color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800', label: 'Medium' },
    high: { color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800', label: 'High' },
    urgent: { color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800', label: 'Urgent' }
  };

  const handleToggleComplete = async () => {
    if (isUpdating || loading) return;
    
    setIsUpdating(true);
    try {
      await onUpdate(task.id, {
        status: task.status === 'completed' ? 'pending' : 'completed'
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdating || loading) return;
    
    setIsUpdating(true);
    try {
      await onUpdate(task.id, {
        isStarred: !task.isStarred
      });
    } catch (error) {
      console.error('Error toggling star:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDueDate(task.dueDate || '');
    setIsEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editTitle.trim() || isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority,
        category: editCategory,
        dueDate: editDueDate || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (isDeleting || loading) return;
    
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const isCompleted = task.status === 'completed';

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-300 overflow-hidden
      ${isCompleted ? 'border-gray-100 dark:border-gray-700 opacity-80' : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900'}
      ${isDeleting ? 'scale-95 opacity-50' : 'scale-100'}
    `}>
      {isEditing ? (
        // Edit Mode
        <form onSubmit={handleSaveEdit} className="p-5 space-y-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 text-lg font-semibold bg-transparent border-b-2 border-blue-500 outline-none
                       text-gray-900 dark:text-white pb-1"
              maxLength={100}
              autoFocus
            />
          </div>
          
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Add description..."
            rows={2}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-none text-gray-600 dark:text-gray-400 
                     focus:ring-2 focus:ring-blue-500 resize-none text-sm"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as any)}
              className="p-2 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 border-none outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
            <input
              type="date"
              value={editDueDate.split('T')[0]}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="p-2 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 border-none outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        // Display Mode
        <div className="relative group">
          {/* Priority Indicator Line */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${
            task.priority === 'urgent' ? 'bg-red-500' : 
            task.priority === 'high' ? 'bg-orange-500' : 
            task.priority === 'medium' ? 'bg-blue-500' : 'bg-green-500'
          }`} />

          <div className="p-4 sm:p-5 flex items-start space-x-4">
            {/* Checkbox */}
            <button
              onClick={handleToggleComplete}
              className={`
                flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 mt-1
                flex items-center justify-center
                ${isCompleted 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-inner' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-transparent'
                }
              `}
            >
              {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0" onClick={() => setIsExpanded(!isExpanded)}>
              <div className="flex items-center justify-between">
                <h3 className={`
                  text-base sm:text-lg font-semibold transition-all duration-300 truncate cursor-pointer
                  ${isCompleted ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'}
                `}>
                  {task.title}
                </h3>
                
                <div className="flex items-center space-x-2 ml-2">
                  <button
                    onClick={handleToggleStar}
                    className={`p-1.5 rounded-full transition-all duration-200 ${
                      task.isStarred 
                        ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                        : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${task.isStarred ? 'fill-current' : ''}`} />
                  </button>
                  <div className="sm:hidden">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>
              </div>

              {/* Meta Badges - Always Visible */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${priorityConfig[task.priority].color}`}>
                  {task.priority}
                </span>
                
                {task.category !== 'general' && (
                  <span className="flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-[10px] font-bold rounded-md border border-gray-200 dark:border-gray-600">
                    <Target className="w-2.5 h-2.5 mr-1" />
                    {task.category.toUpperCase()}
                  </span>
                )}

                {task.dueDate && (
                  <span className={`flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                    task.isOverdue && !isCompleted
                      ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                      : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                  }`}>
                    <Calendar className="w-2.5 h-2.5 mr-1" />
                    {formatDate(task.dueDate)}
                    {task.isOverdue && !isCompleted && ' (OVERDUE)'}
                  </span>
                )}
              </div>

              {/* Expanded Content */}
              {(isExpanded || task.description) && (
                <div className={`mt-3 space-y-3 transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 sm:opacity-100 sm:max-h-96'} overflow-hidden`}>
                  {task.description && (
                    <p className={`text-sm leading-relaxed ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-600 dark:text-gray-400'}`}>
                      {task.description}
                    </p>
                  )}

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {task.tags.map(tag => (
                        <span key={tag} className="flex items-center px-2 py-0.5 bg-blue-50/50 dark:bg-blue-900/10 text-blue-500 dark:text-blue-400 text-[10px] font-medium rounded border border-blue-100/50 dark:border-blue-800/30">
                          <Tag className="w-2.5 h-2.5 mr-1 opacity-70" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats & Actions Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50 mt-4">
                    <div className="flex items-center space-x-3 text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {isCompleted ? `Done ${getRelativeTime(task.completedAt || task.updatedAt)}` : `Added ${getRelativeTime(task.createdAt)}`}
                      </div>
                      {task.estimatedTime && (
                        <div className="flex items-center">
                          <Target className="w-3 h-3 mr-1" />
                          Est. {task.estimatedTime}m
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        title="Edit Task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;