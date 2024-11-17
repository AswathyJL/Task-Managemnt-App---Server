const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
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
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Not Yet Started", "Ongoing", "Completed", "Pending"],
    },
    userId: {
      type: String, // Reference to the User
      required: true,
      ref: "users",
    },
    progress: {
      type: Number,
      default: 0, // Default progress is 0
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
