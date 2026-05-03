import React from 'react';
import { Plus, X, Calendar, Clock, Tag, Star, Target, Hash } from 'lucide-react';
import { CreateTaskDto } from '../types';

interface AddTaskFormProps {
  onSubmit: (task: CreateTaskDto) => Promise<void>;
  loading: boolean;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSubmit, loading }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [category, setCategory] = React.useState('general');
  const [dueDate, setDueDate] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState('');
  const [isStarred, setIsStarred] = React.useState(false);
  const [estimatedTime, setEstimatedTime] = React.useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Popular categories for quick selection
  const popularCategories = ['general', 'work', 'personal', 'study', 'health', 'shopping', 'family'];
  
  // Priority colors and labels
  const priorityConfig = {
    low: { color: 'bg-green-100 text-green-800 border-green-200', label: '🟢 Low', icon: '⬇️' },
    medium: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: '🔵 Medium', icon: '➡️' },
    high: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: '🟠 High', icon: '⬆️' },
    urgent: { color: 'bg-red-100 text-red-800 border-red-200', label: '🔴 Urgent', icon: '🚨' }
  };

  // Helper functions
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formatTimeDisplay = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const taskData: CreateTaskDto = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category: category || 'general',
        dueDate: dueDate || undefined,
        tags: tags.length > 0 ? tags : undefined,
        isStarred,
        estimatedTime: typeof estimatedTime === 'number' ? estimatedTime : undefined
      };
      
      await onSubmit(taskData);
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('general');
      setDueDate('');
      setTags([]);
      setNewTag('');
      setIsStarred(false);
      setEstimatedTime('');
      setIsExpanded(false);
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('general');
    setDueDate('');
    setTags([]);
    setNewTag('');
    setIsStarred(false);
    setEstimatedTime('');
    setIsExpanded(false);
  };

  const handleTitleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-xl border border-blue-200 dark:border-gray-600 overflow-hidden backdrop-blur-sm">
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-xl shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              {/* Star badge */}
              {isStarred && (
                <div className="absolute -top-1 -right-1 p-1 bg-yellow-400 rounded-full shadow-md">
                  <Star className="w-3 h-3 text-yellow-800 fill-current" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onClick={handleTitleClick}
                placeholder="✨ What would you like to accomplish today?"
                className="w-full text-lg font-medium bg-transparent border-none outline-none 
                         text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400
                         focus:ring-0 focus:border-none transition-all duration-200"
                maxLength={100}
                disabled={isSubmitting || loading}
              />
              {/* Quick info display */}
              {!isExpanded && title.trim() && (
                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className={`px-2 py-1 rounded-full border ${priorityConfig[priority].color}`}>
                    {priorityConfig[priority].label}
                  </span>
                  {category !== 'general' && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      📁 {category}
                    </span>
                  )}
                  {dueDate && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      📅 {new Date(dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
            {title.trim() && !isExpanded && (
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                ⏎ Quick add
              </div>
            )}
          </div>
        </div>

        {/* Expanded Form */}
        {isExpanded && (
          <div className="px-6 pb-6 space-y-6 animate-slide-up border-t border-blue-100 dark:border-gray-700 pt-6">
            
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-4">
              {/* Star Toggle */}
              <button
                type="button"
                onClick={() => setIsStarred(!isStarred)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border-2 transition-all duration-200 ${
                  isStarred 
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-400' 
                    : 'bg-gray-50 border-gray-100 text-gray-500 dark:bg-gray-800/50 dark:border-gray-700 hover:border-gray-200'
                }`}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{isStarred ? 'Starred' : 'Star Task'}</span>
              </button>

              {/* Priority Picker */}
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800/50 p-1 rounded-xl border border-gray-100 dark:border-gray-700">
                {(Object.keys(priorityConfig) as Array<keyof typeof priorityConfig>).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                      priority === p 
                        ? priorityConfig[p].color + ' shadow-sm scale-105' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    {priorityConfig[p].label.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Selection */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Target className="w-4 h-4 mr-2 text-blue-500" />
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-xl
                             text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    {popularCategories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Hash className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Due Date Picker */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-xl
                           text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Estimated Time */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  Time Estimate
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="Minutes"
                    min="1"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-xl
                             text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  {estimatedTime && (
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                      {formatTimeDisplay(Number(estimatedTime))}
                    </span>
                  )}
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Tag className="w-4 h-4 mr-2 text-blue-500" />
                  Tags
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add tag..."
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-xl
                               text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      disabled={tags.length >= 5}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!newTag.trim() || tags.length >= 5}
                    className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {/* Tags Display */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map(tag => (
                      <span key={tag} className="flex items-center space-x-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-md border border-blue-100 dark:border-blue-800 animate-fade-in">
                        <span>#{tag}</span>
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <span className="text-blue-600 dark:text-blue-400 mr-2 text-lg">📝</span>
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details, context, or notes about your task..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                         bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400
                         transition-all duration-200 resize-none backdrop-blur-sm
                         shadow-inner hover:shadow-md"
                maxLength={500}
                disabled={isSubmitting || loading}
              />
              <div className="mt-2 flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                  💡 Pro tip: Detailed tasks are 40% more likely to be completed!
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {description.length}/500
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium
                         text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
                         bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600
                         border-2 border-gray-200 dark:border-gray-600 rounded-xl
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400
                         shadow-sm hover:shadow-md backdrop-blur-sm"
                disabled={isSubmitting || loading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>

              <div className="flex items-center space-x-4">
                {title.trim() && (
                  <div className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-gray-700 px-3 py-1 rounded-full border border-blue-100 dark:border-gray-600">
                    ⌨️ Press <strong>Enter</strong> to save
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={!title.trim() || isSubmitting || loading}
                  className="inline-flex items-center px-8 py-2.5 text-sm font-semibold
                           text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                           disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                           rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           dark:focus:ring-offset-gray-800
                           shadow-lg hover:shadow-xl disabled:shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Task
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Add Hint */}
        {!isExpanded && title.trim() && (
          <div className="px-6 pb-4">
            <div className="text-xs text-center py-2 bg-blue-50 dark:bg-gray-700/50 rounded-lg text-blue-600 dark:text-blue-400 font-medium">
              ⚡ Press Enter to add quickly • Click anywhere to expand for details
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTaskForm;