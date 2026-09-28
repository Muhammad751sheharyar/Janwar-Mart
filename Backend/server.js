const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const animalRoutes = require("./routes/animalRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "JanwarMart Backend is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});