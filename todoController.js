const todoModel = require('../models/todoModel');

exports.getAllTodos = (req, res) => {
    todoModel.getTodos((err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch todos' });
        res.json(results);
    });
};

exports.createTodo = (req, res) => {
    const { title, date, priority, category_id, status_id } = req.body;

    if (!title || !date || !priority || !category_id || !status_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    todoModel.addTodo(title, date, priority, category_id, status_id, (err, result) => {
        if (err) {
            console.error('Error adding todo:', err);  // log error here
            return res.status(500).json({ error: 'Failed to add todo', details: err.sqlMessage || err.message });
        }
        res.json({ id: result.insertId, title, date, priority, category_id, status_id });
    });
};


exports.updateTodo = (req, res) => {
    const { id } = req.params;
    const { title, date, priority, category_id, status_id } = req.body;

    if (!title || !date || !priority || !category_id || !status_id) {
        return res.status(400).json({ error: 'All fields (title, date, priority, category_id, status_id) are required' });
    }

    todoModel.updateTodo(id, title, date, priority, category_id, status_id, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to update todo' });
        res.json({ id, title, date, priority, category_id, status_id });
    });
};

exports.deleteTodo = (req, res) => {
    const { id } = req.params;
    todoModel.deleteTodo(id, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete todo' });
        res.json({ message: 'Todo deleted' });
    });
};
