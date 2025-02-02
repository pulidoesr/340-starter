const express = require("express")
const router = express.Router()
const invMgm = require("../controllers/inventoryController");

// Route for Inventory Management View
router.get("/", invMgm.InventoryManagement); 

// Process routes (MVC approach)
router.get("/add-classification", invMgm.addClassification);
router.get("/add-vehicle", invMgm.addVehicle);

module.exports = router;
