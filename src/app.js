const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

// --- Security headers (Issue 12) ---
app.use(helmet());

// --- CORS: restrict to the frontend origin only (Issue 5) ---
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// --- Auth rate limiter: skipped in test env (Issue 6) ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 20,                   // max 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
  skip: () => process.env.NODE_ENV === 'test', // never block test suite
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    status: 'ok',
    db: dbState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve frontend in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running. Set NODE_ENV=production to serve the frontend.');
  });
}

module.exports = { app };
