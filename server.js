const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to PostgreSQL successfully!");
    release();
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Afribay Adventures API is running...");
});

// Get all destinations
app.get("/api/destinations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, image_url FROM destinations"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all hotels
app.get("/api/hotels", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, location, image_url FROM hotels"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all offers
app.get("/api/offers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, discount, description FROM offers"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
