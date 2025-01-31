// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")


router.get('/login', utilities.handleErrors(accountController.buildLogin)); // Ensure this is correctly imported

/*
  Deliver Registration View
*/
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/*
  Process Registration
*/
router.post("/register", utilities.handleErrors(accountController.buildRegisterAccount))

module.exports = router;