const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, default: 'Admin' }
});

module.exports = mongoose.model('Admin', adminSchema);
