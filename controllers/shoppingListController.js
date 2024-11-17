const ShoppingList = require('../models/ShoppingList');
const mongoose = require('mongoose');
const findMemberRole = (list, userId) =>
  list.members.find((member) => member.userId.equals(userId))?.role;

exports.removeItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    const list = await ShoppingList.findById(id);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    console.log("Shopping List:", list);

    const owner = list.members.find((member) => member.role === "Owner");

    if (!owner) {
      console.error("List does not have an owner");
      return res.status(500).json({ error: "Server error: Missing owner" });
    }

    if (!owner.userId.equals(req.user.id)) {
      console.error("Access denied: User is not the owner");
      return res.status(403).json({ error: "Forbidden: Only the owner can remove items" });
    }

    console.log("Owner verified:", req.user.id);

    const initialLength = list.items.length;
    list.items = list.items.filter((item) => item._id && !item._id.equals(itemId));

    if (list.items.length === initialLength) {
      return res.status(404).json({ error: "Item not found" });
    }

    await list.save();

    console.log("Item removed successfully");
    res.status(200).json({ status: "success", shoppingList: list });
  } catch (error) {
    console.error("Error removing item:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;

    const list = await ShoppingList.findById(id);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    const role = findMemberRole(list, req.user.id);
    if (role !== "Owner") {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (list.members.some((member) => member.userId.equals(memberId))) {
      return res.status(400).json({ error: "Member already exists" });
    }

    list.members.push({ userId: memberId, role: "Member" });
    await list.save();

    res.json({ shoppingList: list });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;

    const list = await ShoppingList.findById(id);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    console.log("Current List:", list);

    const currentUser = list.members.find((member) =>
      member.userId?.toString() === req.user.id
    );

    if (!currentUser) {
      console.error("User not in the list");
      return res.status(403).json({ error: "Forbidden: User is not in the list" });
    }

    const currentUserRole = currentUser.role;

    console.log("Current User Role:", currentUserRole);

    if (currentUserRole === "Owner") {
      list.members = list.members.filter(
        (member) => member.userId?.toString() !== memberId
      );
    } else if (currentUserRole === "Member") {
      // only member can delete himself
      if (req.user.id !== memberId) {
        console.error("Members can only remove themselves");
        return res
          .status(403)
          .json({ error: "Forbidden: Members can only remove themselves" });
      }
      list.members = list.members.filter(
        (member) => member.userId?.toString() !== req.user.id
      );
    }

    await list.save();

    res.status(200).json({ status: "success", shoppingList: list });
  } catch (error) {
    console.error("Error removing member:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};


exports.createShoppingList = async (req, res) => {
  try {
    const { name, items, members } = req.body;

    const newList = new ShoppingList({
      name,
      ownerId: req.user.id,
      members: [{ userId: req.user.id, role: "Owner" }],
      items: items || [],
    });

    if (members && Array.isArray(members)) {
      members.forEach((memberId) => {
        if (!newList.members.some((member) => member.userId.equals(memberId))) {
          newList.members.push({ userId: memberId, role: "Member" });
        }
      });
    }

    await newList.save();

    res.status(201).json({ status: "success", shoppingList: newList });
  } catch (error) {
    console.error("Error creating shopping list:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getAllShoppingLists = async (req, res) => {
  try {
    console.log("User ID:", req.user.id);

    const lists = await ShoppingList.find({
      $or: [
        { ownerId: req.user.id },
        { "members.userId": req.user.id }
      ],
    });

    console.log("Fetched lists:", lists);

    res.status(200).json({ shoppingLists: lists });
  } catch (error) {
    console.error("Error fetching shopping lists:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getShoppingList = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) return res.status(404).json({ status: "error", error: "List not found" });

    res.json({ list, status: "success", error: null });
  } catch (error) {
    res.status(500).json({ list: null, status: "error", error: error.message });
  }
};

exports.updateShoppingList = async (req, res) => {
  try {
    const list = await ShoppingList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: "success", error: null });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.deleteShoppingList = async (req, res) => {
  try {
    const list = await ShoppingList.findByIdAndDelete(req.params.id);
    if (!list) return res.status(404).json({ status: "error", error: "List not found" });

    res.json({ status: "success", error: null });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.updateItems = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) return res.status(404).json({ status: "error", error: "List not found" });

    list.items = req.body.items;
    await list.save();

    res.json({ status: "success", error: null });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.archiveList = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) return res.status(404).json({ status: "error", error: "List not found" });

    list.isArchived = true;
    await list.save();

    res.json({ status: "success", error: null });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.restoreList = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) return res.status(404).json({ status: "error", error: "List not found" });

    list.isArchived = false;
    await list.save();

    res.json({ status: "success", error: null });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
