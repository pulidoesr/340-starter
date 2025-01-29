
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

module.exports = account 
