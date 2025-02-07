const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*
  Login Data Validation Rules
  */
 validate.loginRules = () =>{
  return [
    body("account_email")  
       .trim()
       .isEmail()
       .normalizeEmail() //refer to validator.js docs
       .withMessage("A valid email is required.")
       .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists) {
          throw new Error("Email does not exists.")
        }
       }),
  ]
 }
/*
  Registration Data Validation Rules
*/
validate.registrationRules = () => {
  return [
    // name is required and must be string
    body("account_firstname")
      .trim()
      .isString()
      .isLength({ min: 1})
      .withMessage("Please provide a first name."),
    // name is required and must be string
    body("account_lastname")
       .trim()
       .isString()
       .isLength({ min:1 })
       .withMessage("Please provide a last name.",),
    // valid email is required and cannot already exist in the database
    body("account_email")  
       .trim()
       .isEmail()
       .normalizeEmail() //refer to validator.js docs
       .withMessage("A valid email is required.")
       .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please login or use different email")
        }
       }),
    // password is required and must be strong password
    body("account_password")
       .trim()
       .isStrongPassword({
         minLength: 12,
         minLowercase: 1,
         minUppercase: 1,
         minNumbers: 1,
         minSymbols:1, 
       })
       .withMessage("Password does not meet requirements.")
  ]
}

validate.checkLoginData = async (req, resizeBy, next) => {
  const { account_email} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let loginPage = await utilities.buildLoginPage(account_email)
    resizeBy.render("account/login", {
      errors,
      title: "Login",
      nav,
      loginPage
    })
    return
  }
  next()
}

validate.checkRegData = async (req, resizeBy, next) => {
  const { account_firstname, account_lastname, account_email} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let registerPage = await utilities.buildRegisterPage(account_firstname, account_lastname, account_email)
    resizeBy.render("account/register", {
      errors,
      title: "Registration",
      nav,
      registerPage,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate