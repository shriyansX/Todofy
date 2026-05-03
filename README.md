# 🚀 Todofy - Advanced Personal Task Manager

<div align="center">
  
  ![Todofy Demo](https://via.placeholder.com/600x300/3b82f6/ffffff?text=Todofy+Advanced+Task+Manager)
  
  **A beautiful, premium task management application with advanced features and full-stack authentication.**
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://todofy-seven.vercel.app)
  [![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000.svg)](https://vercel.com)
  [![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://mongodb.com)
  
</div>

## ✨ Advanced Features

### 🔐 **Full-Stack Authentication**
- **User Accounts** - Sign up and Log in to save your tasks permanently across devices.
- **JWT Security** - Secure session management using JSON Web Tokens.
- **Guest Mode** - Still supports anonymous usage via browser fingerprinting if you don't want an account.
- **Auto-Sync** - Tasks are associated with your account automatically when you log in.

### 🎨 **Premium UI/UX Design**
- **Glass-morphism & Gradients** - Modern, sleek interface with beautiful animated backgrounds.
- **Interactive Task Forms** - Expandable creation forms with priority, category, and tag support.
- **Dark/Light Mode** - Intelligent theme switching with system preference detection.
- **Fluid Animations** - Smooth transitions and micro-interactions powered by Framer Motion principles.

### 📱 **Smart Task Management**
- **Priority System** - Categorize tasks as Low, Medium, High, or Urgent with color-coded indicators.
- **Smart Filtering** - Filter by All, Active, Completed, Starred, Overdue, or Tasks Due Today.
- **Category & Tags** - Organize tasks into projects and add up to 5 custom tags per task.
- **Due Dates & Deadlines** - Set deadlines and get visual "Overdue" alerts.
- **Time Estimation** - Track how long you expect tasks to take.

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript** for type safety
- **TailwindCSS** for modern, responsive styling
- **Lucide React** for beautiful icons
- **Axios** with interceptors for robust API communication

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose ODM**
- **Security**: Helmet, CORS, and Express-Rate-Limit
- **Isolation**: Custom middleware for browser-fingerprint based data isolation

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/shriyansX/Todofy.git
   cd Todofy
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Setup environment variables**
   Create `.env` in the `server` directory with your `MONGODB_URI`.

4. **Run the application**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks (supports `status`, `isStarred`, `isOverdue`, `today` params) |
| `POST` | `/api/tasks` | Create a new task with full metadata |
| `PUT` | `/api/tasks/:id` | Update any task field |
| `DELETE` | `/api/tasks/:id` | Permanent task removal |

---

<div align="center">
  
  **Built with the MERN Stack + TypeScript + TailwindCSS**
  
  [Live Demo](https://todofy-eexut0m8z-shriyanss-projects-ce7d7e18.vercel.app) • [Report Bug](https://github.com/shriyansX/Todofy/issues) • [Request Feature](https://github.com/shriyansX/Todofy/issues)
  
</div>modern design principles
- Built with ❤️ for productivity enthusiasts

---

<div align="center">
  
  **Built with the MERN Stack + TypeScript + TailwindCSS**
  
  [Live Demo](https://todofy.vercel.app) • [Report Bug](https://github.com/yourusername/todofy/issues) • [Request Feature](https://github.com/yourusername/todofy/issues)
  
</div>