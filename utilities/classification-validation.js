const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*
  Registration Data Validation Rules
*/
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .custom((value) => {
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          throw new Error("Only letters and numbers are allowed. No spaces or special characters.");
        }
        return true;
      }) // ✅ Proper way to enforce alphanumeric without `.matches()`
  ];
};


validate.checkClasData = async (req, res, next) => { 

  const { classification_name } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let addClassification = await utilities.addClassification(classification_name || ""); 
    return res.render("inventory/add-classification", {  
      errors: errors.array(),
      title: "Add New Classification",
      nav,
      addClassification
    });
  }
  next(); // ✅ Ensure request moves to `processClassification`
};

module.exports = validate;