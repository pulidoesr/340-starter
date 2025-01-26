// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/inv/type/:classificationId", invController.buildByClassificationId);

// Route to get individual car details
router.get("/inv/detail/:invId", invController.buildCarDetail);


router.use((req, res) => {
  console.log("Unhandled route in inventoryRoute.js:", req.method, req.url);
  res.status(404).send("Route not found in inventoryRoute.js.");
});


module.exports = router;