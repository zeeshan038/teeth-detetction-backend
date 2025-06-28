const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

// Paths

const apiRoutes = require("./routes/index");
const connectDb = require("./config/db");

// Connect to DB
connectDb();

// 🔧 Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));


// Parse JSON and form-urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});