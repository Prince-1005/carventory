const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    status: 'ok',
    db: dbState === 1 ? 'connected' : 'disconnected'
  });
});

module.exports = { app };
