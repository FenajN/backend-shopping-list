const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: [String], enum: ['Member', 'Owner'], default: ['Member'] }, // Роль зависит от списка
  shoppingLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingList' }]
});

module.exports = mongoose.model('User', userSchema);
