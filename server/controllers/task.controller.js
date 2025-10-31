const User = require("../model/User");
const Task = require("../model/Task");

// create a new task
const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;

    const newTask = new Task({
      title,
      user: userId,
    });

    await newTask.save();

    return res
      .status(201)
      .json({ msg: "Task created successfully", task: newTask });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// get all tasks for a user
const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ user: userId });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// update a task by id
const updateTask = async (req, res) => {
  try {
    const { title, completed } = req.body;
    const userId = req.user._id;
    const taskId = req.params.id;

    // Validation: at least one field should be provided
    if (title === undefined && completed === undefined) {
      return res.status(400).json({ 
        msg: "At least one field (title or completed) must be provided" 
      });
    }

    // Build update object dynamically (only include provided fields)
    const updateFields = {};
    if (title !== undefined) {
      // Validate title
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ 
          msg: "Title must be a non-empty string" 
        });
      }
      updateFields.title = title.trim();
    }
    if (completed !== undefined) {
      // Validate completed
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ 
          msg: "Completed must be a boolean value" 
        });
      }
      updateFields.completed = completed;
    }

    // Update the task
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    return res.status(200).json({ 
      msg: "Task updated successfully", 
      task: updatedTask 
    });
  } catch (error) {
    console.error("Update task error:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ msg: "Invalid task ID format" });
    }
    
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// delete a task by id
const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.id;

    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    if (!deletedTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    return res
      .status(200)
      .json({ msg: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
