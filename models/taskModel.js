// Import mongoose
const mongoose = require('mongoose');

// Create schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value >= this.startDate;
      },
      message: 'End date must be after or on the start date.',
    },
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Not Yet Started', 'Ongoing', 'Completed', 'Pending'],
  },
  taskImg: {
    type: String, // URL of the image or file path
    default: null, // Optional
  },
  userId: {
    type: String, // Reference to the User
    required: true,
    ref: 'users',
  },
  progress: {
    type: Number,
    default: 0, // Default progress is 0
    min: 0,
    max: 100,
  },
}, { timestamps: true });

// Create model
const Task = mongoose.model('Task', taskSchema);

// Export model
module.exports = Task;
