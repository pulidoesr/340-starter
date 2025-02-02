const pool = require("../database/")

async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

/*
  Register new classification
*/
async function registerNewClassification(classification_name){
  try {
    console.log("Attempting to insert:", classification_name);
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    const values = [classification_name]
    const result = await pool.query(sql, values)
    console.log("Insert result:", result.rows[0])
    return result.rows[0]
  }
  catch (error){
    console.error("❌ Database error:", error.message); // Log the actual error message
    return null;
  }
}

module.exports = { checkExistingClassification, registerNewClassification};