// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")
const checkAuth = require("../utilities/checkAuth")


/* 
 Deliver Login View
 */

router.get('/login', utilities.handleErrors(accountController.buildLogin)); // Ensure this is correctly imported
router.get('/accountview', utilities.handleErrors(accountController.accountView));
router.get("/register", utilities.handleErrors(accountController.buildRegister))
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
  Process Registration
*/
router.post("/register",
  regValidate.registrationRules(),
  regValidate.checkRegData, 
  utilities.handleErrors(accountController.buildRegisterAccount))

// Logout Control
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Acount Management
router.get("/update/:accountId", 
  checkAuth,
  utilities.handleErrors(accountController.buildUpdateAccount));

router.get("/change-password", accountController.renderChangePasswordForm);

// ✅ Process Account Update Route
router.post("/update/:accountId", 
  checkAuth, 
  utilities.handleErrors(accountController.processUpdateAccount)
);

router.post("/change-password", accountController.updatePassword);

console.log("✅ accountRoute.js is loaded.");
router.stack.forEach((r) => {
    if (r.route) {
        console.log("✅ Account Route Registered:", r.route.path);
    }
});


module.exports = router;