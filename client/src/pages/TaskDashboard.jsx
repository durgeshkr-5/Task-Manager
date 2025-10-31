import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleViewMode,
} from "../features/tasks/taskSlice";
import { LayoutGrid, List, Plus } from "lucide-react";
import TaskGridView from "../components/TaskGridView";
import TaskListView from "../components/TaskListView";

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading, viewMode } = useSelector((state) => state.tasks);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch tasks on mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Add new task
  const handleAddTask = () => {
    if (!title.trim()) return;
    dispatch(addTask({ title }));
    setTitle("");
  };

  // Edit task
  const handleEditTask = (id, currentTitle) => {
    setEditId(id);
    setEditText(currentTitle);
  };

  // Save edited task
  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    dispatch(updateTask({ id, updatedData: { title: editText } }));
    setEditId(null);
    setEditText("");
  };

  // Delete task
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20 ">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Tasks</h2>
          <button
            onClick={() => dispatch(toggleViewMode())}
            className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            {viewMode === "grid" ? (
              <>
                <List size={18} />
                <span>List View</span>
              </>
            ) : (
              <>
                <LayoutGrid size={18} />
                <span>Grid View</span>
              </>
            )}
          </button>
        </div>

        {/* Add Task Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter a new task..."
            className="border border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={18} /> Add
          </button>
        </div>

        {/* Task Display */}
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400 italic">
            No tasks yet — add one above!
          </p>
        ) : viewMode === "grid" ? (
          <TaskGridView
            tasks={tasks}
            editId={editId}
            editText={editText}
            setEditText={setEditText}
            handleEditTask={handleEditTask}
            handleSaveEdit={handleSaveEdit}
            handleDelete={handleDelete}
          />
        ) : (
          <TaskListView
            tasks={tasks}
            editId={editId}
            editText={editText}
            setEditText={setEditText}
            handleEditTask={handleEditTask}
            handleSaveEdit={handleSaveEdit}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;
