import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const TaskGridView = ({
  tasks,
  editId,
  editText,
  setEditText,
  handleEditTask,
  handleSaveEdit,
  handleDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks?.map((task) => (
        <div
          key={task._id}
          className="border border-gray-200 rounded-lg shadow-sm bg-white p-4 flex flex-col justify-between hover:shadow-md transition"
        >
          <div className="flex-1 mb-3">
            {editId === task._id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
            )}
          </div>

          <div className="flex justify-end gap-3">
            {editId === task._id ? (
              <button
                onClick={() => handleSaveEdit(task._id)}
                className="text-green-600 hover:text-green-800 font-semibold"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => handleEditTask(task._id, task.title)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
            )}

            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-500 hover:text-red-700"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskGridView;
