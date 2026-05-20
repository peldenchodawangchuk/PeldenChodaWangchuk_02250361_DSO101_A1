const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let todos = [];

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const todo = {
        id: todos.length + 1,
        title: req.body.title,
        done: false
    };
    todos.push(todo);
    res.status(201).json(todo);
});

app.listen(PORT, () => {
    console.log(`Todo app running on port ${PORT}`);
});

module.exports = app;