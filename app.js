const express = require('express');
const app = express();
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/todos', todoRoutes);

app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});

// Error handler middleware (for Express)
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
