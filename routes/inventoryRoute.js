// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/inv/type/:classificationId", invController.buildByClassificationId);

// Route to get individual car details
router.get("/inv/detail/:invId", invController.buildCarDetail);

// handling a GET request to /inventory
router.get("/", (req, res) => {
  res.send("Inventory home page");
});

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