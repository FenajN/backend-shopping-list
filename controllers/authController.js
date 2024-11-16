const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  debugger;

  try {
    console.log('Request Body:', req.body);

    if (!username || !password) {
      console.error('Username or password not provided');
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in .env file');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const user = await User.findOne({ username });
    console.log('User found:', user);

    if (!user) {
      console.error(`User with username "${username}" not found`);
      return res.status(400).json({ error: 'Invalid username' });
    }

    if (user.password !== password) {
      console.error('Invalid password for user:', username);
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`User ${username} successfully logged in`);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

