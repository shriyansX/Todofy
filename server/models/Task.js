const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    default: 'general'
  },
  dueDate: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  subtasks: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Subtask title cannot exceed 100 characters']
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isStarred: {
    type: Boolean,
    default: false
  },
  estimatedTime: {
    type: Number, // in minutes
    min: [1, 'Estimated time must be at least 1 minute'],
    max: [10080, 'Estimated time cannot exceed a week (10080 minutes)']
  },
  completedAt: {
    type: Date,
    default: null
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for efficient querying
taskSchema.index({ userId: 1, status: 1, createdAt: -1 });
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, category: 1 });
taskSchema.index({ userId: 1, isStarred: -1 });

// Pre-save middleware to handle timestamps and completedAt
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set completedAt when status changes to completed
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status === 'pending') {
      this.completedAt = null;
    }
  }
  
  next();
});

// Transform output to include virtual fields and calculations
taskSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    
    // Calculate overdue status
    if (ret.dueDate && ret.status !== 'completed') {
      ret.isOverdue = new Date(ret.dueDate) < new Date();
    } else {
      ret.isOverdue = false;
    }
    
    // Calculate subtask completion progress
    if (ret.subtasks && ret.subtasks.length > 0) {
      const completedSubtasks = ret.subtasks.filter(st => st.completed).length;
      ret.subtaskProgress = {
        completed: completedSubtasks,
        total: ret.subtasks.length,
        percentage: Math.round((completedSubtasks / ret.subtasks.length) * 100)
      };
    }
    
    return ret;
  }
});

module.exports = mongoose.model('Task', taskSchema);