
const utilities = require('../utilities')
const registrationModel = require('../models/registration-model')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


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
      let nav = await utilities.getNav()
      req.flash("notice", "Sorry, there was an error processing the registration.")
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
      })
    }
    const regResult = await registrationModel.registerAccount(
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

/* 
  Process login request
  */


  account.accountLogin = async function (req, res, next) {
    try {
      let nav = await utilities.getNav();
      const { account_email, account_password } = req.body;
      const accountData = await accountModel.getAccountByEmail(account_email);
  
      if (!accountData) {
        req.flash("notice", "Invalid email or password.");
        return res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email });
      }
  
      const isPasswordValid = await bcrypt.compare(account_password, accountData.account_password);
      if (!isPasswordValid) {
        req.flash("notice", "Invalid email or password.");
        return res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email });
      }
  
      delete accountData.account_password; // Remove password before sending user data
      req.session.accountData = accountData;
      console.log("✅ Session Data Set:", req.session.accountData); 
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
  
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      req.session.save((err) => { // ✅ Manually save session
        if (err) {
            console.error("❌ Error Saving Session:", err);
            req.flash("notice", "Session error, please try again.");
            return res.redirect("/account/login");
        }})
      return res.redirect("/account/accountview");
    } catch (error) {
      next(error); // ✅ Correctly pass errors to Express error handling
    } 
  };
  
/* 
  login Management request
  */
  account.accountView = async function (req, res, next) {
    try {
      let nav = await utilities.getNav();
      const accountData = req.session.accountData;
      if (!accountData) {
        console.log("❌ No session data found.");
        req.flash("notice", "You must be logged in to access the account page.");
        return res.redirect("/account/login");
    }
      console.log("✅ Account Session Found:", accountData);
      let accountview = await utilities.accountView();
      return res.render("account/accountview", {
        title: "Account View",
        nav,
        accountview
    });
    } catch (error) {
      next(error); // ✅ Correctly pass errors to Express error handling
    }
  };

  /* 
    Account Logout
  */
  account.logout = async function (req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout Error:", err);
        return res.redirect("/account");
      }
      res.clearCookie("jwt");
      res.redirect("/");
    });
  };

  account.buildUpdateAccount = async function (req, res, next) {
    try {
        let nav = await utilities.getNav();
        const accountId = req.params.accountId;
        const accountData = await accountModel.getAccountById(accountId);

        if (!accountData) {
            req.flash("notice", "Account not found.");
            return res.redirect("/account/accountview");
        }

        res.render("account/update", {
            title: "Update Account Information",
            nav,
            accountData,
            errors: null,
        });
    } catch (error) {
        next(error);
    }
};

account.processUpdateAccount = async function (req, res, next) {
  try {
      const { account_id, account_firstname, account_lastname, account_email } = req.body;

      let nav = await utilities.getNav();
      const updateResult = await accountModel.updateAccountById(
          account_id,
          account_firstname,
          account_lastname,
          account_email
      );

      if (updateResult) {
          req.flash("notice", "Account information updated successfully.");
          return res.redirect("/account/accountview");
      } else {
          req.flash("error", "Update failed. Please try again.");
          return res.status(500).render("account/update", {
              title: "Update Account Information",
              nav,
              accountData: { account_id, account_firstname, account_lastname, account_email },
              errors: [],
          });
      }
  } catch (error) {
      console.error("Error updating account:", error);
      next(error);
  }
};


module.exports = account 
