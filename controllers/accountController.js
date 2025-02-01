
const utilities = require('../utilities')
const accountModel = require('../models/registration-model');


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
  let registerPage = await utilities.buildRegisterPage()
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

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
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
