require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expoRoutes = require("./routes/expoRoutes");
const boothRoutes = require("./routes/boothRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const messageRoutes = require("./routes/messageRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();
const server = http.createServer(app);

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: { origin: clientUrl, methods: ["GET", "POST"], credentials: true },
});

app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// controllers can reach socket.io through req.app.get("io")
app.set("io", io);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/expos", expoRoutes);
app.use("/api/booths", boothRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    if (userId) socket.join(userId);
  });

  socket.on("disconnect", () => {
    // nothing to clean up yet — rooms are left automatically
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
