// Needed Resources 
const express = require("express")
const router = new express.Router() 
const inventoryController = require("../controllers/inventoryController")
const utilities = require("../utilities")
const regValidate = require("../utilities/classification-validation")
const invValidate= require("../utilities/inventory-validation")


// Process routes (MVC approach)
router.get("/add-classification",
   utilities.checkAdminAuth,
   inventoryController.addClassification);

router.post(
  "/add-classification",
   utilities.checkAdminAuth,
   regValidate.classificationRules(),
   regValidate.checkClasData, 
   inventoryController.processClassification
);


// Route to show the add vehicle form
router.get("/add-vehicle",
  utilities.checkAdminAuth,
   inventoryController.addInventory);

// Route to get individual car details
router.get("/detail/:invId", inventoryController.buildCarDetail);

// Route to build inventory by classification view
router.get("/type/:classificationId", inventoryController.buildByClassificationId);


// Route to process form submission
router.post("/add-inventory", 
  utilities.checkAdminAuth,
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  inventoryController.processInventory
);

/*
   Get inventoryt for AJAX Route
*/
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(inventoryController.getInventoryJSON)
);

/*
   Edit Inventory for AJAX Route
*/
router.get(
  "/edit/:invId",
  utilities.checkAdminAuth,
  utilities.handleErrors(inventoryController.editInventoryById)
)

/*
   Delete Inventory for AJAX Route
*/
router.get(
  "/delete/:invId",
  utilities.checkAdminAuth,
  utilities.handleErrors(inventoryController.deleteInventoryById)
)
/*
  Update car inventory selected
*/
router.post(
  "/update",
  utilities.checkAdminAuth,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(inventoryController.updateInventory))

/*
  delete car inventory selected
*/
router.post(
  "/delete",
  utilities.checkAdminAuth,
  utilities.handleErrors(inventoryController.deleteInventory))

// Route for Inventory Management View
router.get("/", 
  utilities.checkAdminAuth,
  utilities.handleErrors(inventoryController.buildManagementView)); 

// Example: Handle /inventory/error-log
router.post("/error-log", (req, res) => {
  console.error("Client-side error logged:", req.body);
  res.status(200).json({ message: "Error logged in inventory routes" });
});

router.use((req, res) => {
  console.log("Unhandled route in inventoryRoute.js:", req.method, req.url);
  res.status(404).send("Route not found in inventoryRoute.js.");
});



module.exports = router;