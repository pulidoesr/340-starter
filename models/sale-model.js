const pool = require("../database/")

// Fetch clients only
exports.getClients = async () => {
  const query = "SELECT account_id, account_firstname, account_lastname FROM account WHERE account_type = 'Client'";
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
exports.getAvailableCars = async (classificationId) => {
  const query = "SELECT * FROM inventory WHERE classification_id = $1 AND (invoice_number IS NULL OR invoice = 0)";
  const { rows } = await pool.query(query, [classificationId]);
  return rows;
};

// Process the sale (update inventory and invoice tables)
exports.processSale = async (invoice_id, invoice_number, invoice_customer, invoice_date, invoice_inv_id, invoice_price, invoice_taxrate, invoice_taxamount, inovoice_discount, invoice_total) => {
  const invoiceQuery = `
      INSERT INTO invoice (invoice_id, invoice_number, invoice_customer, invoice_date, invoice_inv_id, invoice_price, invoice_taxrate, invoice_taxamount, inovoice_discount, invoice_total)
      VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, $10) RETURNING invoice_id;
  `;
  const { rows } = await pool.query(invoiceQuery, [invoice_id, invoice_number, invoice_customer, invoice_date, invoice_inv_id, invoice_price, invoice_taxrate, invoice_taxamount, inovoice_discount, invoice_total]);
  
  const invoiceId = rows[0].invoice_id;

  // Update inventory with invoice reference
  await pool.query("UPDATE inventory SET invoice = $1 WHERE id = $2", [invoice_id, invoice_inv_id]);

  return invoice_id;
};