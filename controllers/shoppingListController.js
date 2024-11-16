const ShoppingList = require('../models/ShoppingList');

exports.createShoppingList = async (req, res) => {
  try {
    const list = new ShoppingList(req.body);
    await list.save();
    res.json({ shoppingList: list._id, status: "success", error: null });
  } catch (error) {
    res.status(500).json({ shoppingList: null, status: "error", error: error.message });
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

    list.items = req.body.items; // Предполагаем, что массив items передаётся в теле запроса
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
