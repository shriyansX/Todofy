const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const taskRoutes = require('./routes/tasks');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://todofy.vercel.app', 'https://todofy-git-main.vercel.app'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Todofy API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Todofy API',
    endpoints: {
      tasks: '/api/tasks',
      health: '/',
      stats: '/api/tasks/stats/summary'
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/tasks', taskRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  let message = 'Something went wrong!';
  let statusCode = 500;

  if (error.name === 'ValidationError') {
    message = 'Validation Error';
    statusCode = 400;
  } else if (error.name === 'CastError') {
    message = 'Invalid ID format';
    statusCode = 400;
  } else if (error.code === 11000) {
    message = 'Duplicate field value';
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  // Close server & exit process
  // server.close(() => {
  //   process.exit(1);
  // });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

module.exports = app;