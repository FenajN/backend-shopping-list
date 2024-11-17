const jwt = require("jsonwebtoken");
const ShoppingList = require("../models/ShoppingList");

const authMiddleware = (requiredRole) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (requiredRole && requiredRole === "Admin" && req.user.role !== "Admin") {
      console.error("Access denied: Not an admin");
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    if (requiredRole && requiredRole !== "Admin") {
      const { id } = req.params;
      const list = await ShoppingList.findById(id);

      if (!list) {
        return res.status(404).json({ error: "List not found" });
      }

      const isMemberOrOwner =
        list.members.some((member) => member.userId.equals(req.user.id)) ||
        list.ownerId.equals(req.user.id);

      if (!isMemberOrOwner) {
        console.error("Access denied: User not a member or owner");
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      console.error("Invalid JWT Token:", error.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    console.error("Authorization error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = authMiddleware;






