const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'ecosegregate_secret_key_default_987654';

// Middleware to verify active session
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Please sign in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired. Please sign in again.' });
    }
    req.userId = decoded.id;
    req.username = decoded.username;
    next();
  });
};

// GET state
router.get('/state', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.state);
  } catch (err) {
    console.error('Fetch state error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST state (save state updates)
router.post('/state', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Overwrite state with requested state
    user.state = req.body;
    await user.save();

    res.json({ success: true, state: user.state });
  } catch (err) {
    console.error('Update state error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
