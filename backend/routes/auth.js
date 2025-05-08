const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register
router.post('/register', async (req, res) => {
  console.log('Incoming registration data:', req.body);
  try {
    const { password, ...userData } = req.body;
    
    // Validate required fields
    if (!userData.email || !password || !userData.fullName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Create user (password hashed via pre-save hook)
    const user = new User({ ...userData, password });
    await user.save();

    // Generate JWT
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.fullName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.fullName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;