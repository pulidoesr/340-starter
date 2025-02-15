const express = require("express");
const saleController = require("../controllers/saleController");
const router = express.Router();
const utilities = require("../utilities")


// Route for Inventory Management View
router.get("/", 
    utilities.checkAdminAuth,
    utilities.handleErrors(saleController.getSalePage));
router.get("/cars/:classificationId", utilities.handleErrors(saleController.getCarsByClassification));
router.get("/car-details/:carId", saleController.getCarDetails);

router.post("/process-sale", utilities.handleErrors(saleController.processSale));

module.exports = router;