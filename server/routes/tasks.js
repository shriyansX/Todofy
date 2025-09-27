const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, sort = '-createdAt' } = req.query;
    let filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
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
// @desc    Get single task by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
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
// @desc    Create a new task
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
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
      status: status || 'pending'
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
// @desc    Update a task
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    // Find the task first
    let task = await Task.findById(req.params.id);
    
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
    
    if (description !== undefined) {
      task.description = description.trim();
    }
    
    if (status !== undefined) {
      if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be either "pending" or "completed"'
        });
      }
      task.status = status;
    }
    
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
// @desc    Delete a task
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
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
// @desc    Get task statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    
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