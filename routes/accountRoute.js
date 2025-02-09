// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")


/* 
 Deliver Login View
 */

router.get('/login', utilities.handleErrors(accountController.buildLogin)); // Ensure this is correctly imported
router.get('/accountview', utilities.handleErrors(accountController.accountView));
router.get("/", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountView)
)
/*
 Process Login
 */
router.post ("/login",
regValidate.loginRules(),
regValidate.checkLoginData,
utilities.handleErrors(accountController.accountLogin))

/*
 Process Account
 */
 router.post ("/account",
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountView))


/*
  Deliver Registration View
*/
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/*
  Process Registration
*/
router.post("/register",
  regValidate.registrationRules(),
  regValidate.checkRegData, 
  utilities.handleErrors(accountController.buildRegisterAccount))

// Lougout Control
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;