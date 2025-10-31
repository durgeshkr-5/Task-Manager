import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Your backend API URL
const API_URL = import.meta.env.VITE_BASE_URL + "/tasks/";

// ================== 🔹 ASYNC THUNKS 🔹 ==================

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load tasks"
      );
    }
  }
);

// Add new task
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(API_URL, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add task"
      );
    }
  }
);

// Update existing task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put(`${API_URL}${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update task"
      );
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${API_URL}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

// ================== 🔹 INITIAL STATE 🔹 ==================
const initialState = {
  tasks: [],
  loading: false,
  error: null,
  viewMode: "grid", // 'grid' or 'list'
};

// ================== 🔹 SLICE 🔹 ==================
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === "grid" ? "list" : "grid";
    },
  },
  extraReducers: (builder) => {
    // ===== FETCH TASKS =====
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== ADD TASK =====
    builder
      .addCase(addTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        const newTask = action.payload.task;
        if (newTask && newTask._id) {
          state.tasks = [newTask, ...state.tasks]; // ✅ ensure it's added to top
        }
      })

      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== UPDATE TASK =====
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;

        // Extract the updated task from API response
        const updatedTask = action.payload?.task;

        if (updatedTask && updatedTask._id) {
          state.tasks = state.tasks.map((t) =>
            t._id === updatedTask._id ? updatedTask : t
          );
        }
      })

      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      });

    // ===== DELETE TASK =====
    builder
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { toggleViewMode } = taskSlice.actions;
export default taskSlice.reducer;
