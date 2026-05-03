import React from 'react';
import { Moon, Sun, CheckSquare, User, RefreshCw, LogIn, LogOut } from 'lucide-react';
import { UserUtils } from '../utils/userUtils';
import { AuthService } from '../services/api';
import Auth from './Auth';

interface HeaderProps {
  username: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUsernameChange: (username: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  username,
  darkMode,
  onToggleDarkMode,
  onUsernameChange,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempUsername, setTempUsername] = React.useState(username);
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await AuthService.getCurrentUser();
      if (user) setCurrentUser(user.data);
    };
    fetchUser();
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setCurrentUser(userData);
    onUsernameChange(userData.username);
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    window.location.reload();
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = tempUsername.trim();
    if (trimmedUsername) {
      onUsernameChange(trimmedUsername);
      setIsEditing(false);
    }
  };

  const handleUsernameCancel = () => {
    setTempUsername(username);
    setIsEditing(false);
  };

  const handleNewSession = () => {
    if (window.confirm('This will start a new session with separate tasks. Continue?')) {
      UserUtils.resetUserId();
      window.location.reload();
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-xl border-b border-blue-500/20 dark:border-gray-700 transition-all duration-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg">
              <CheckSquare className="w-8 h-8 text-white dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white dark:text-white drop-shadow-sm">
                Todofy
              </h1>
              <p className="text-sm text-blue-100 dark:text-gray-400 mt-1">
                Your Personal Task Manager
              </p>
            </div>
          </div>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {/* Session Info */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-100 dark:text-gray-300 font-medium">
                Session: {UserUtils.getUserDisplayId()}
              </span>
              <button
                onClick={handleNewSession}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Start new session"
              >
                <RefreshCw className="w-3 h-3 text-blue-200 dark:text-gray-400" />
              </button>
            </div>

            {/* Username Display/Edit */}
            <div className="flex items-center space-x-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-3 py-2">
              <User className="w-5 h-5 text-blue-200 dark:text-gray-400" />
              {isEditing ? (
                <form onSubmit={handleUsernameSubmit} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="px-3 py-1 text-sm border border-white/20 dark:border-gray-600 rounded-md 
                             bg-white/20 dark:bg-gray-800 text-white dark:text-white placeholder-blue-200 dark:placeholder-gray-400
                             focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm
                             transition-all duration-200"
                    placeholder="Enter your name"
                    autoFocus
                    maxLength={30}
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleUsernameCancel}
                    className="px-2 py-1 bg-red-500/80 text-white text-xs rounded hover:bg-red-600 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium text-white dark:text-gray-300 
                           hover:text-blue-100 dark:hover:text-white 
                           transition-colors duration-200 cursor-pointer
                           px-2 py-1 rounded hover:bg-white/10"
                >
                  {username || 'Set your name'}
                </button>
              )}
            </div>

            {/* Auth Toggle */}
            <div className="flex items-center space-x-2">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLogout}
                    className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm transition-all duration-200 group shadow-lg"
                    title="Log Out"
                  >
                    <LogOut className="w-5 h-5 text-red-200" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="p-3 rounded-xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm
                           hover:bg-white/20 dark:hover:bg-gray-700/70 
                           transition-all duration-200 group shadow-lg flex items-center space-x-2"
                >
                  <LogIn className="w-5 h-5 text-blue-100" />
                  <span className="hidden md:inline text-xs font-bold text-white uppercase tracking-widest">Sign In</span>
                </button>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className="p-3 rounded-xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm
                         hover:bg-white/20 dark:hover:bg-gray-700/70 
                         transition-all duration-200 group shadow-lg"
                aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-300 group-hover:text-yellow-200 transition-colors drop-shadow-sm" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-100 group-hover:text-white transition-colors drop-shadow-sm" />
                )}
              </button>
            </div>
            
            <Auth 
              isOpen={isAuthOpen} 
              onClose={() => setIsAuthOpen(false)} 
              onSuccess={handleAuthSuccess} 
            />
          </div>
        </div>
        
        {/* Welcome Message */}
        {username && (
          <div className="mt-6 animate-fade-in">
            <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10 dark:border-gray-700">
              <p className="text-blue-100 dark:text-gray-300 text-center">
                Welcome back, <span className="font-semibold text-white dark:text-blue-300">{username}</span>! 
                <span className="ml-2">Let's make today productive ✨</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
