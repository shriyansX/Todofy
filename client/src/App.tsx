import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Components
import Header from './components/Header';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import Footer from './components/Footer';

// Hooks and utilities
import useLocalStorage from './hooks/useLocalStorage';
import useTasks from './hooks/useTasks';
import { FilterType, AppSettings } from './types';

function App() {
  // Local storage for app settings
  const [settings, setSettings] = useLocalStorage<AppSettings>('todofy-settings', {
    darkMode: false,
    username: '',
    currentFilter: 'all',
    sortBy: 'created',
    viewType: 'list',
    defaultCategory: 'general',
    showCompletedTasks: true,
    enableNotifications: false,
  });

  // Tasks management
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
  } = useTasks(settings.currentFilter);

  // Dark mode effect
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Handle settings updates
  const handleToggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const handleUsernameChange = (username: string) => {
    setSettings(prev => ({ ...prev, username }));
  };

  const handleFilterChange = (filter: FilterType) => {
    setSettings(prev => ({ ...prev, currentFilter: filter }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {/* Header */}
      <Header
        username={settings.username}
        darkMode={settings.darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onUsernameChange={handleUsernameChange}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Error Banner */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-700 rounded-2xl p-6 animate-slide-up backdrop-blur-sm shadow-xl">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-red-100 dark:bg-red-800/50 rounded-xl shadow-sm">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                    🚨 Oops! Something went wrong
                  </h3>
                  <p className="mt-2 text-red-700 dark:text-red-400">
                    {error}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={refreshTasks}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium
                               text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-800/30
                               hover:bg-red-200 dark:hover:bg-red-800/50
                               border-2 border-red-300 dark:border-red-700 rounded-xl
                               transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500
                               shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again ✨
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Task Form */}
          <div className="animate-fade-in">
            <AddTaskForm onSubmit={createTask} loading={loading} />
          </div>

          {/* Task List */}
          <div className="animate-fade-in">
            <TaskList
              tasks={tasks}
              currentFilter={settings.currentFilter}
              onFilterChange={handleFilterChange}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              loading={loading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;