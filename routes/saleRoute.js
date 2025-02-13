const express = require("express");
const saleController = require("../controllers/saleController");
const router = express.Router();
const utilities = require("../utilities")


// Route for Inventory Management View
router.get("/", 
    utilities.checkAdminAuth,
    utilities.handleErrors(saleController.getSalePage));
router.get("/cars/:classificationId", utilities.handleErrors(saleController.getCarsByClassification));
router.post("/process-sale", utilities.handleErrors(saleController.processSale));

console.log("✅ saleRoute.js is loaded.");
router.stack.forEach((r) => {
    if (r.route) {
        console.log("✅ Sale Route Registered:", r.route.path);
    }
});

module.exports = router;
