const pool = require("../database/")

/*
  Register new account
*/
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    console.log("Attempting to insert:", account_firstname, account_lastname, account_email, account_password);
    const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    const values = [account_firstname, account_lastname, account_email, account_password]
    const result = await pool.query(sql, values)
    console.log("Insert result:", result.rows[0])
    return result.rows[0]
  }
  catch (error){
    console.error("❌ Database error:", error.message); // Log the actual error message
    return null;
  }
}

module.exports = { registerAccount }