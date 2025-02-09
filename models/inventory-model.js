const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


/* ***************************
 *  Get a Single Car by car_id
 * ************************** */
async function getCarDetailById(invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
          WHERE inv_id = $1`,
      [invId]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/*
 Build vehicle management view
*/

/* ***************************
 *  insert a new Car
 * ************************** */
async function registerNewInventory(
  classification_id, inv_make, inv_model, inv_year,
  inv_description, inv_image, inv_thumbnail, inv_price,
  inv_miles, inv_color
) {
  try {
      const sql = `
          INSERT INTO inventory (
              classification_id, inv_make, inv_model, inv_year,
              inv_description, inv_image, inv_thumbnail, inv_price,
              inv_miles, inv_color
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING inv_id;`;

      const values = [
          classification_id, inv_make, inv_model, inv_year,
          inv_description, inv_image, inv_thumbnail, inv_price,
          inv_miles, inv_color
      ];

      const result = await pool.query(sql, values);
      return result.rowCount > 0; // Return `true` if insert was successful
  } catch (error) {
      console.error("Database insert error:", error);
      return false;
  }
}

/* ***************************
 *  update a Car
 * ************************** */
async function updateInventoryById(
  inv_id, inv_make, inv_model, inv_year,
  inv_description, inv_image, inv_thumbnail, inv_price,
  inv_miles, inv_color
) {
  try {
      const sql = `
          UPDATE public.inventory
            SET inv_make = $2, inv_model = $3, inv_year = $4, inv_description = $5,
                inv_image = $6, inv_thumbnail = $7, inv_price = $8, inv_miles = $9,
                inv_color = $10
            WHERE inv_id = $1
            RETURNING inv_id`;

      const values = [
          inv_id, inv_make, inv_model, inv_year, inv_description,
          inv_image, inv_thumbnail, inv_price, inv_miles, 
          inv_color
      ];

      const result = await pool.query(sql, values);
      return result.rowCount > 0; // Return `true` if update was successful
  } catch (error) {
      console.error("Database update error:", error);
      return false;
  }
}



module.exports = { getInventoryByClassificationId, getClassifications, getCarDetailById, registerNewInventory, updateInventoryById }