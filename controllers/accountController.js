
const utilities = require('../utilities')
const accountModel = require('../models/registration-model');
const bcrypt = require("bcryptjs")


const account = {}
/* ****************************************
*  Deliver login view
* *************************************** */
account.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  const loginPage = await utilities.buildLoginPage()
  res.render("account/login", {
    title: "Login",
    nav,
    loginPage
  })
}

/*
  Deliver registration view
*/
account.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
   // Ensure the values exist, otherwise, set them to an empty string
   let account_firstname = res.locals.account_firstname || "";
   let account_lastname = res.locals.account_lastname || "";
   let account_email = res.locals.account_email || "";
  let registerPage = await utilities.buildRegisterPage(account_firstname, account_lastname, account_email)
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    registerPage
  })
}

account.buildRegisterAccount = async function (req, res) {
  try {
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    } = req.body;
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password,10)
    } catch (error) {
      req.flash("notice", "Sorry, there was an error processing the registration.")
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
      })
    }
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}, Please log in.`);
      return res.status(201).redirect("./login");
    } else {
      req.flash("notice", "Sorry, the registration failed.");
    }
  } catch (error) {
    console.error("Registration Error:", error);   
  }
}


module.exports = account 
