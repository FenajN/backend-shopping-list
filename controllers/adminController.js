const User = require('../models/User');
const ShoppingList = require('../models/ShoppingList');

exports.getAllLists = async (req, res) => {
  try {
    const lists = await ShoppingList.find();
    res.json({ shoppingLists: lists, status: "success", error: null });
  } catch (error) {
    res.status(500).json({ shoppingLists: [], status: "error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ status: "success", error: null });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.deleteOwner = async (req, res) => {
  try {
    const list = await ShoppingList.findOne({ ownerId: req.params.id });
    if (!list) return res.status(404).json({ status: "error", error: "Owner or list not found" });

    await ShoppingList.findByIdAndDelete(list._id);
    await User.findByIdAndDelete(req.params.id);

    res.json({ status: "success", error: null });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};