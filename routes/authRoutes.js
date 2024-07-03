import express from 'express';
import { registerUser, loginUser, validateToken } from '../services/authService.js';

const router = express.Router();

// User registration route
router.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    await registerUser(username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// User login route
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const token = await loginUser(username, password);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Token validation route
router.post('/auth/validate', async (req, res) => {
    const { token } = req.body;
    try {
      const decoded = await validateToken(token);
      res.json({ valid: true, decoded });
    } catch (err) {
      res.status(401).json({ valid: false, message: 'Invalid token', error: err.message });
    }
  });

export default router;
