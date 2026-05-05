const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Create tasks table automatically
async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tasks table is ready");
  } catch (error) {
    console.error("Error creating table:", error.message);
  }
}

createTable();

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Todo CRUD API is running successfully",
  });
});

// CREATE task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description)
       VALUES ($1, $2)
       RETURNING *`,
      [title, description || ""]
    );

    res.status(201).json({
      message: "Task created successfully",
      task: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});

// READ all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );

    res.status(200).json({
      message: "Tasks fetched successfully",
      count: result.rows.length,
      tasks: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

// READ single task
app.get("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task fetched successfully",
      task: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch task",
      error: error.message,
    });
  }
});

// UPDATE task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const existingTask = await pool.query(
      "SELECT * FROM tasks WHERE id = $1",
      [id]
    );

    if (existingTask.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const updatedTitle = title ?? existingTask.rows[0].title;
    const updatedDescription =
      description ?? existingTask.rows[0].description;
    const updatedCompleted =
      completed ?? existingTask.rows[0].completed;

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, completed = $3
       WHERE id = $4
       RETURNING *`,
      [updatedTitle, updatedDescription, updatedCompleted, id]
    );

    res.status(200).json({
      message: "Task updated successfully",
      task: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});

// DELETE task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      deletedTask: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});