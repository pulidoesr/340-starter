
const utilities = require('../utilities')

const account = {}
/* ****************************************
*  Deliver login view
* *************************************** */
account.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  const loginPage = await utilities.buildLoginPage()
  console.log("Generated Login Page HTML:", loginPage); // Debugging log
  res.render("account/login", {
    title: "Login",
    nav,
    loginPage
  })
}

/*
  Deliver registration view
*/
account.buildRegister = async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  let registerPage = await utilities.buildRegisterPage()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    registerPage
  })
}
module.exports = account 
