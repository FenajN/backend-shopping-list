const User = require('../models/User');
const Admin = require('../models/Admin');

const authMiddleware = (role) => async (req, res, next) => {
  const userId = req.userId;

  let user = await User.findById(userId) || await Admin.findById(userId);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (role === 'Admin' && user.role !== 'Admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (role !== 'Admin' && !user.role.includes(role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.user = user;
  next();
};

module.exports = authMiddleware;
