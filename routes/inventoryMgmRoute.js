const express = require("express")
const router = express.Router()
const invMgm = require("../controllers/inventoryController");
const regValidate = require("../utilities/classification-validation")


// Process routes (MVC approach)
router.get("/add-classification", invMgm.addClassification);
router.get("/add-vehicle", invMgm.addInventory);

// Route for Inventory Management View
router.get("/", invMgm.InventoryManagement); 

router.post(
  "/add-classification",
   regValidate.classificationRules(),
   regValidate.checkClasData, 
   invMgm.processClassification
);

// Route to show the add vehicle form
router.get("/add-vehicle", invMgm.addInventory);

// Route to process form submission
router.post("/add-inventory", invMgm.addInventory);

module.exports = router;
