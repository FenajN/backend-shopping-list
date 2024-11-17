const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { login } = require('../controllers/authController');
const { registerUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);

router.post('/login', async (req, res) => {
  const { username } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = await Admin.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username' });
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
