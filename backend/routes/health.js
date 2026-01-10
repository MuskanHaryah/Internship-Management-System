const router = require('express').Router();

// Health check endpoint for deployment platforms
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API info endpoint
router.get('/info', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'Internship Management System API',
      version: '1.0.0',
      status: 'active'
    }
  });
});

module.exports = router;
