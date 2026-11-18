const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const taskRoutes = require('./routes/tasks');

const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: true,
    })
  );
  app.use(express.json());
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'todo-list-api' });
  });

  app.use('/api/tasks', taskRoutes);

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  });

  return app;
};

module.exports = createApp;
