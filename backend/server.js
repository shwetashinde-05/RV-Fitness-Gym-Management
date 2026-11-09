const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin requests
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root Healthcheck API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'RV FITNESS Gym Management API',
    location: 'Narsobawadi, Maharashtra, India',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount modular REST APIs
app.use('/api', apiRoutes);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.url}`
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`   🏋️ RV FITNESS GYM MANAGEMENT SYSTEM - BACKEND      `);
  console.log(`   📍 Narsobawadi, Maharashtra, India                 `);
  console.log(`   🚀 Server running at: http://localhost:${PORT}      `);
  console.log(`=======================================================`);
});
