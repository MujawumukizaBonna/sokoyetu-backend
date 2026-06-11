const pool = require('../db');

// GET /api/products?supplier_id=
const getProducts = async (req, res) => {
  const { supplier_id } = req.query;
  try {
    let query = 'SELECT * FROM products WHERE available = true';
    const params = [];
    if (supplier_id) {
      params.push(supplier_id);
      query += ` AND supplier_id = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/products — manufacturer adds product
const createProduct = async (req, res) => {
  const { name, emoji, price_rwf, unit, moq, stock, category } = req.body;
  if (!name || !price_rwf || !moq) {
    return res.status(400).json({ error: 'Name, price and MOQ are required' });
  }
  try {
    const supplierResult = await pool.query(
      'SELECT id FROM suppliers WHERE user_id = $1', [req.user.id]
    );
    if (supplierResult.rows.length === 0) {
      return res.status(403).json({ error: 'No supplier profile found' });
    }
    const supplier_id = supplierResult.rows[0].id;
    const result = await pool.query(
      `INSERT INTO products (supplier_id, name, emoji, price_rwf, unit, moq, stock, category)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [supplier_id, name, emoji || '📦', price_rwf, unit || 'unit', moq, stock || 0, category || 'General']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create product error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/products/:id — manufacturer updates product
const updateProduct = async (req, res) => {
  const { name, price_rwf, unit, moq, stock, available, emoji } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET
        name = COALESCE($1, name),
        price_rwf = COALESCE($2, price_rwf),
        unit = COALESCE($3, unit),
        moq = COALESCE($4, moq),
        stock = COALESCE($5, stock),
        available = COALESCE($6, available),
        emoji = COALESCE($7, emoji)
      WHERE id = $8 RETURNING *`,
      [name, price_rwf, unit, moq, stock, available, emoji, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    await pool.query('UPDATE products SET available = false WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deactivated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
