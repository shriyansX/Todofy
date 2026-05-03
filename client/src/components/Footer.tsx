import React from 'react';
import { Heart, Github, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Main Footer Content */}
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
            <span>by developers, for productivity enthusiasts</span>
          </div>

          {/* Tech Stack */}
          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-500">
            <div className="flex items-center space-x-1">
              <span>Built with</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">React</span>
              <span>+</span>
              <span className="font-semibold text-green-600 dark:text-green-400">Node.js</span>
              <span>+</span>
              <span className="font-semibold text-green-700 dark:text-green-300">MongoDB</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/yourusername/todofy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 
                       hover:text-gray-900 dark:hover:text-gray-200 
                       transition-colors duration-200"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">Source Code</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 
                       hover:text-gray-900 dark:hover:text-gray-200 
                       transition-colors duration-200"
            >
              <span className="text-sm">Deployed on Vercel</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
            <p>© {currentYear} Todofy. All rights reserved.</p>
            <p className="mt-1">
              A modern task management application built with the MERN stack.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;