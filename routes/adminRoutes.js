const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

router.post("/login", authController.adminLogin);

router.get("/lists", authMiddleware("Admin"), adminController.getAllLists);

router.delete("/user/:id", authMiddleware("Admin"), adminController.deleteUser);

router.delete("/list/:id", authMiddleware("Admin"), adminController.deleteList);

module.exports = router;
