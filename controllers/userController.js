const ShoppingList = require('../models/ShoppingList');
const User = require('../models/User');

exports.getUserLists = async (req, res) => {
  try {
    const lists = await ShoppingList.find({
      $or: [
        { ownerId: req.user._id },
        { members: req.user._id }
      ]
    });
    res.json({ shoppingLists: lists, status: "success", error: null });
  } catch (error) {
    res.status(500).json({ shoppingLists: [], status: "error", error: error.message });
  }
};

exports.removeSelfFromList = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) return res.status(404).json({ status: "error", error: "List not found" });

    list.members = list.members.filter(memberId => memberId.toString() !== req.user._id.toString());
    await list.save();

    res.json({ status: "success", error: null });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: `^${search}$`, $options: "i" } },
        { email: { $regex: `^${search}$`, $options: "i" } }
      ],
    }).select("id username email");

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

