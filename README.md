# Todofy - Modern Task Management App

<div align="center">
  
  ![Todofy Logo](https://via.placeholder.com/150x150?text=Todofy&color=3B82F6&bg=EFF6FF)
  
  **A modern, responsive to-do list application built with the MERN stack**
  
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/todofy)
  
</div>

## ✨ Features

- **🎨 Modern UI/UX**: Clean, intuitive design with dark/light mode toggle
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **⚡ Real-time Updates**: Instant task updates with optimistic UI
- **🗂️ Smart Filtering**: Filter tasks by All, Active, or Completed
- **📊 Progress Tracking**: Visual progress bars and completion statistics
- **💾 Persistent Storage**: Tasks saved to MongoDB with localStorage for settings
- **🌙 Dark Mode**: Eye-friendly dark theme with smooth transitions
- **👤 User Personalization**: Customizable username with local storage
- **🔄 Offline-Ready**: Graceful error handling and retry mechanisms

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Axios** for API calls
- **Custom Hooks** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **CORS** and **Helmet** for security
- **Rate limiting** for API protection
- **Environment-based configuration**

### Deployment
- **Vercel** for both frontend and serverless backend
- **MongoDB Atlas** for cloud database

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local) or MongoDB Atlas account
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/todofy.git
   cd todofy
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   npm run client:install
   
   # Install server dependencies
   npm run server:install
   ```

3. **Setup environment variables**
   
   Create `.env` files in both client and server directories:
   
   **Server (.env)**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todofy
   PORT=5000
   NODE_ENV=development
   ```
   
   **Client (.env)**:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas and update MONGODB_URI
   ```

5. **Run the application**
   ```bash
   # Start both client and server concurrently
   npm run dev
   
   # Or start them separately
   npm run server:dev  # Server on http://localhost:5000
   npm run client:dev  # Client on http://localhost:3000
   ```

## 🌐 Deployment

### Deploy to Vercel

1. **Prepare for deployment**
   
   Update environment variables for production:
   
   **Server**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todofy
   NODE_ENV=production
   ```
   
   **Client**:
   ```env
   REACT_APP_API_URL=https://your-app.vercel.app/api
   ```

2. **Deploy using Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

3. **Or deploy using GitHub integration**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

### Environment Variables for Production

Set these in your Vercel dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | Database connection |
| `NODE_ENV` | `production` | Environment mode |
| `REACT_APP_API_URL` | `https://yourapp.vercel.app/api` | API base URL |

## 📁 Project Structure

```
todofy/
├── client/                 # React frontend
│   ├── public/            # Public assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.tsx
│   │   │   ├── AddTaskForm.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   └── Footer.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useTasks.ts
│   │   ├── services/      # API services
│   │   │   └── api.ts
│   │   ├── types/         # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx        # Main App component
│   │   └── index.tsx      # React entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Express backend
│   ├── config/           # Database configuration
│   │   └── database.js
│   ├── models/           # Mongoose models
│   │   └── Task.js
│   ├── routes/           # API routes
│   │   └── tasks.js
│   ├── index.js          # Server entry point
│   └── package.json
├── vercel.json           # Vercel deployment config
├── package.json          # Root package.json
└── README.md
```

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks (with optional filtering) |
| `GET` | `/api/tasks/:id` | Get single task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/tasks/stats/summary` | Get task statistics |

### Example API Usage

```javascript
// Create a new task
POST /api/tasks
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "status": "pending"
}

// Update task status
PUT /api/tasks/123
{
  "status": "completed"
}

// Get filtered tasks
GET /api/tasks?status=pending
```

## 🎨 Components Overview

### Header Component
- Logo and app title
- Dark/light mode toggle
- Username display and editing
- Responsive design

### AddTaskForm Component
- Expandable task creation form
- Title and description inputs
- Form validation and loading states
- Keyboard shortcuts support

### TaskList Component
- Filtering tabs (All, Active, Completed)
- Progress tracking and statistics
- Empty states with contextual messages
- Loading skeletons

### TaskItem Component
- Inline editing capabilities
- Checkbox for status toggle
- Delete confirmation
- Hover actions and animations

### Footer Component
- App information and credits
- Links to source code and deployment platform

## 🔧 Customization

### Theming

The app uses Tailwind CSS with a custom color palette. To customize colors, edit `client/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
        500: '#your-color',
        600: '#your-darker-color',
        // ...
      }
    }
  }
}
```

### Adding New Features

1. **Backend**: Add new routes in `server/routes/`
2. **Frontend**: Create new components in `client/src/components/`
3. **State Management**: Use custom hooks in `client/src/hooks/`
4. **Types**: Update TypeScript interfaces in `client/src/types/`

## 🧪 Testing

```bash
# Run client tests
cd client && npm test

# Run server tests (if implemented)
cd server && npm test
```

## 📦 Building for Production

```bash
# Build client for production
npm run client:build

# The build folder will contain the optimized production files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- UI components inspired by modern design principles
- Built with ❤️ for productivity enthusiasts

---

<div align="center">
  
  **Built with the MERN Stack + TypeScript + TailwindCSS**
  
  [Live Demo](https://todofy.vercel.app) • [Report Bug](https://github.com/yourusername/todofy/issues) • [Request Feature](https://github.com/yourusername/todofy/issues)
  
</div>