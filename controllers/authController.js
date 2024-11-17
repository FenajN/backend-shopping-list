const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");


exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received login request:", { username, password });

    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.error("Admin not found with username:", username);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    console.log("Admin found:", admin);

    if (password !== admin.password) {
      console.error("Password mismatch for admin:", username);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    console.log("Password matched for admin:", username);

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated JWT token:", token);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: [],
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Request Body:", req.body);

    if (!username || !password) {
      console.error("Username or password not provided");
      return res.status(400).json({ error: "Username and password are required" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in .env file");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const user = await User.findOne({ username });
    console.log("User found:", user);

    if (!user || user.password !== password) {
      console.error("Invalid username or password");
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`User ${username} successfully logged in`);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

