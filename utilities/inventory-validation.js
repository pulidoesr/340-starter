const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*
  Inventory Data Validation Rules
*/
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Make must be at least 2 characters long."),
    
    body("inv_model")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Model must be at least 2 characters long."),
    
    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Please enter a valid year."),
    
    body("inv_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long."),
    
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a non-negative integer."),
    
    body("inv_color")
      .trim()
      .matches(/^[a-zA-Z]+$/)
      .withMessage("Color must contain only letters."),
  ];
};

validate.checkInvData = async (req, res, next) => { 
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let addInventory = await utilities.addInventoryForm(req.body.inv_make || ""); 
    return res.render("inventory/add-inventory", {  
      errors: errors.array(),
      title: "Add New Inventory",
      nav,
      addInventory,
    });
  }
  next();
};

module.exports = validate;
