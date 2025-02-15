const pool = require("../database/")

// Fetch clients only
exports.getClients = async () => {
  const query = "SELECT account_id, account_firstname, account_lastname, account_type FROM account WHERE account_type = 'Client'";
  const { rows } = await pool.query(query);
  return rows;
};

// Fetch classifications
exports.getClassifications = async () => {
  const query = "SELECT classification_id, classification_name FROM classification";
  const { rows } = await pool.query(query);
  return rows;
};

// Fetch available cars by classification
exports.getAvailableCars = async (classification_id) => {
  const query = "SELECT * FROM inventory WHERE classification_id = $1 AND (invoice_id IS NULL OR invoice_id = 0)";
  const { rows } = await pool.query(query, [classification_id]);
  return rows;
};

// Fetch selected car 
exports.getCarById = async (carId) => {
  try {
      const query = `SELECT inv_id, inv_make, inv_model, inv_year, inv_image, inv_price::FLOAT AS inv_price, inv_miles ::FLOAT AS inv_miles, inv_color, invoice_id FROM inventory WHERE inv_id = $1`;
      const result = await pool.query(query, [carId]);
      return result.rows[0] || null; // ✅ Return first row or null
  } catch (error) {
      console.error("Database error in getCarById:", error);
      throw error;
  }
};
// Process the sale (update inventory and invoice tables)
exports.processSale = async (invoice_id, invoice_number, invoice_account_id, invoice_date, invoice_inv_id, invoice_price, invoice_tax_rate, invoice_tax_amount, inovoice_discount, invoice_total) => {
  const invoiceQuery = `
      INSERT INTO invoice (invoice_id, invoice_number, invoice_account_id, invoice_date, invoice_inv_id, invoice_price, invoice_tax_rate, invoice_tax_amount, inovoice_discount, invoice_total)
      VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, $10) RETURNING invoice_id;
  `;
  const { rows } = await pool.query(invoiceQuery, [invoice_id, invoice_number, invoice_account_id, invoice_date, invoice_inv_id, invoice_price, invoice_tax_rate, invoice_tax_amount, inovoice_discount, invoice_total]);
  
  const invoiceId = rows[0].invoice_id;

  // Update inventory with invoice reference
  await pool.query("UPDATE inventory SET invoice_id = $1 WHERE inv_id = $2", [invoice_id, inv_id]);

  return invoiceId;
};