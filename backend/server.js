const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON
app.use(bodyParser.json());

// PostgreSQL connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// ----------------------
// GET all products
// ----------------------
app.get("/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// GET single product
// ----------------------
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// ADD new product
// ----------------------
app.post("/products", async (req, res) => {
  const { name, category, sku, price, stock } = req.body;

  if (!name || !category || !sku || price == null || stock == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO products (name, category, sku, price, stock)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

  try {
    const result = await db.query(sql, [name, category, sku, price, stock]);

    res.json({
      id: result.rows[0].id,
      message: "Product added successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// UPDATE product
// ----------------------
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, sku, price, stock } = req.body;

  const sql = `
    UPDATE products
    SET name = $1, category = $2, sku = $3, price = $4, stock = $5
    WHERE id = $6
    RETURNING *
  `;

  try {
    const result = await db.query(sql, [name, category, sku, price, stock, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// DELETE product
// ----------------------
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
