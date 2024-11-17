require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const shoppingListRoutes = require('./routes/shoppingListRoutes');
const adminRoutes = require("./routes/adminRoutes");

const app = express();

connectDB();

app.use(express.json());

app.use('/api/lists', shoppingListRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/lists', require('./routes/shoppingListRoutes'));
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
