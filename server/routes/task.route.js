const express = require("express");
const {createTask,
  getTasks,
  updateTask,
  deleteTask,} = require("../controllers/task.controller")

const taskRouter = express.Router();

taskRouter.post("/", createTask);
taskRouter.get("/", getTasks);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);



module.exports = taskRouter;