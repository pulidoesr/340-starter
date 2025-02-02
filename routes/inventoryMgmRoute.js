const express = require("express")
const router = express.Router()
const invMgm = require("../controllers/inventoryController");
const regValidate = require("../utilities/classification-validation")


// Process routes (MVC approach)
router.get("/add-classification", invMgm.addClassification);
router.get("/add-vehicle", invMgm.addVehicle);

// Route for Inventory Management View
router.get("/", invMgm.InventoryManagement); 

router.post(
  "/add-classification",
   regValidate.classificationRules(),
   regValidate.checkClasData, 
   invMgm.processClassification
);
module.exports = router;
