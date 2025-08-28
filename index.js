const express = require("express");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

// Paths
const apiRoutes = require("./routes/index");
const connectDb = require("./config/db");

// Connect to DB
connectDb();

// Middleware
app.use(cors());

// Parse JSON and form-urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});