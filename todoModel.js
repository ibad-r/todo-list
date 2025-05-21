const db = require('../db'); // use the callback version

exports.getTodos = (callback) => {
    const query = `
    SELECT todos.id, todos.title, todos.date, todos.priority,
           categories.name AS category,
           statuses.name AS status
    FROM todos
    LEFT JOIN categories ON todos.category_id = categories.id
    LEFT JOIN statuses ON todos.status_id = statuses.id
    ORDER BY todos.date ASC
`;

    db.query(query, callback);
};

exports.addTodo = (title, date, priority, category_id, status_id, callback) => {
    const query = 'INSERT INTO todos (title, date, priority, category_id, status_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, date, priority, category_id, status_id], (err, result) => {
        if (err) {
            console.error('SQL error in addTodo:', err);
            return callback(err);
        }
        callback(null, result);
    });
};


exports.updateTodo = (id, title, date, priority, category_id, status_id, callback) => {
    const query = 'UPDATE todos SET title = ?, date = ?, priority = ?, category_id = ?, status_id = ? WHERE id = ?';
    db.query(query, [title, date, priority, category_id, status_id, id], callback);
};

exports.deleteTodo = (id, callback) => {
    db.query('DELETE FROM todos WHERE id = ?', [id], callback);
};
