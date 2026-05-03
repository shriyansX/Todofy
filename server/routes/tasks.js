const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'todofy_secret_key_123';

// Middleware to get user ID from JWT or fingerprint
const getUserId = (req, res, next) => {
  // 1. Try to get user ID from JWT token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;
      req.isGuest = false;
      return next();
    } catch (err) {
      console.warn('Invalid JWT token provided, falling back to fingerprint');
    }
  }

  // 2. Fallback to browser fingerprint (sent by frontend as x-user-id)
  const fingerprintId = req.headers['x-user-id'];
  
  if (!fingerprintId || fingerprintId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Identification (JWT or User ID) is required.'
    });
  }
  
  req.userId = fingerprintId;
  req.isGuest = true;
  next();
};

// Apply getUserId middleware to all routes
router.use(getUserId);

// @route   GET /api/tasks
// @desc    Get all tasks for the current user
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, isStarred, isOverdue, sort = '-createdAt' } = req.query;
    let filter = { userId: req.userId };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (isStarred !== undefined) {
      filter.isStarred = isStarred === 'true';
    }
    
    if (isOverdue === 'true') {
      filter.dueDate = { $lt: new Date() };
      filter.status = 'pending';
    } else if (req.query.today === 'true') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      filter.dueDate = { $gte: today, $lt: tomorrow };
    }
    
    const tasks = await Task.find(filter).sort(sort);
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task by ID for the current user
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task for the current user
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      status, 
      priority, 
      category, 
      dueDate, 
      tags, 
      isStarred, 
      estimatedTime,
      subtasks 
    } = req.body;
    
    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }
    
    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      priority: priority || 'medium',
      category: category || 'general',
      dueDate: dueDate || null,
      tags: tags || [],
      isStarred: isStarred || false,
      estimatedTime: estimatedTime || null,
      subtasks: subtasks || [],
      userId: req.userId
    });
    
    const savedTask = await task.save();
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task for the current user
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      status, 
      priority, 
      category, 
      dueDate, 
      tags, 
      isStarred, 
      estimatedTime,
      subtasks 
    } = req.body;
    
    // Find the task first (ensure it belongs to the user)
    let task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Update fields if provided
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Task title cannot be empty'
        });
      }
      task.title = title.trim();
    }
    
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (tags !== undefined) task.tags = tags;
    if (isStarred !== undefined) task.isStarred = isStarred;
    if (estimatedTime !== undefined) task.estimatedTime = estimatedTime;
    if (subtasks !== undefined) task.subtasks = subtasks;
    
    const updatedTask = await task.save();
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task for the current user
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/tasks/stats
// @desc    Get task statistics for the current user
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const userFilter = { userId: req.userId };
    const totalTasks = await Task.countDocuments(userFilter);
    const completedTasks = await Task.countDocuments({ ...userFilter, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ ...userFilter, status: 'pending' });
    
    res.json({
      success: true,
      data: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;