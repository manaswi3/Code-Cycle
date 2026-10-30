const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'DSA Revision Tracker API is online',
    timestamp: new Date().toISOString()
  });
});

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dsa_revision_tracker';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`🚀 DSA Revision Tracker Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection warning:', err.message);
    console.warn('Starting Express server in development/offline mode on port', PORT);
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT} (Database pending connection)`);
    });
  });

module.exports = app;
