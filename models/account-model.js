const pool = require("../database/")

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

async function getAccountByEmail (account_email) {
  try {
       const result = await pool.query(
        'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1', [account_email])
       return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById (account_id) {
  try {
    const result = await pool.query(
     'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1', [account_id])
    return result.rows[0]
} catch (error) {
 return new Error("No matching account Id")
}
}

async function updateAccountById (accountId, firstname, lastname, email) {
  try {
      console.log(accountId, firstname, lastname, email)
      const sql = `
          UPDATE account
          SET account_firstname = $1, account_lastname = $2, account_email = $3
          WHERE account_id = $4
          RETURNING *;
      `;

      const values = [firstname, lastname, email, accountId];
      const result = await pool.query(sql, values);
      if (result.rowCount > 0) {
        console.log("✅ Account updated successfully:", result.rows[0]);
        return true;
      } else {
        console.warn("⚠️ No account updated. Possibly incorrect account ID.");
        return false;
      }
    } catch (error) {
      console.error("Database update error:", error);
      if (error.code === "23505") { // PostgreSQL unique violation error code
        throw new Error("Email already in use. Please use a different email.");
      }
      throw new Error("Could not update account");
    }
  }

 // Update account password
async function updatePassword (accountId, hashedPassword) {
  await pool.query("UPDATE account SET account_password = $1 WHERE account_id = $2", [hashedPassword, accountId]);
}; 

module.exports = { checkExistingEmail, getAccountByEmail, updateAccountById, getAccountById, updatePassword };