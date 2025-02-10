const path = require('path')
const pool = require("../database");
const inventoryModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await inventoryModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Build the car detail page HTML
 * ************************************ */
Util.buildCarDetailPage = async function(carData) {
  if(carData && Object.keys(carData).length > 0){
    let detailPage = "<div class=\"car-detail-container\">";
    detailPage += `<h1>${carData.inv_year} ${carData.inv_make} ${carData.inv_model}</h1>`;
    detailPage += `<p class=\"price\">Price: $${new Intl.NumberFormat('en-US').format(carData.inv_price)}</p>`;
    detailPage += `<img src=\"${carData.inv_image}\" alt=\"Image of ${carData.inv_make} ${carData.inv_model}\" class=\"car-image\">`;
    detailPage += '<div class=\"car-details\">';
    detailPage += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(carData.inv_miles)} miles</p>`;
    detailPage += `<p><strong>Color:</strong> ${carData.inv_color}</p>`;
    detailPage += `<p><strong>Description:</strong> ${carData.inv_description}</p>`;
    detailPage += '</div>';
    detailPage += '</div>';
    return detailPage;
    }
     // Return a default message if carData is missing or invalid
  return "<p>Car details are not available.</p>";
};

/* ****************************************
 * Build the login page HTML
 * ************************************ */
Util.buildLoginPage = function() {
  let loginPage = "<div class=\"login-container\">";
  loginPage += "<div class=\"login-box\">";
  
  // Login
  loginPage += "<form id= \"loginForm\" action=\"/account/login\" method=\"POST\">";

  // Email Input
  loginPage += "<label for=\"email\">Email Address:</label>";
  loginPage += "<input type=\"email\" id=\"email\" name=\"account_email\" required>";

  // Password Input
  loginPage += "<label for=\"password\">Password:</label>";
  loginPage += "<input type=\"password\" id=\"password\" name=\"account_password\" required>";
  
  // Password Policy Info
  loginPage += "<p class=\"password-info\">Passwords must be minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character.</p>";

  // Login Button
  loginPage += "<button type=\"submit\" id=\"login-btn\">Login</button>";

  // Register Link
  loginPage += "<p>No account? <a href=\"/account/register\">register</a></p>";

   // End form 
   loginPage += "</form>";  

  loginPage += "</div>"; // Close login-box
  loginPage += "</div>"; // Close login-container

  return loginPage;
};


Util.buildRegisterPage = function (account_firstname = "", account_lastname = "", account_email = "") {
  return `
    <div class="register-container">
      <div class="register-box">
        <form id="registerForm" action="/account/register" method="POST">
          <p class="required-fields"><i>All fields are required.</i></p>

          <label for="account_firstname">First name:</label>
          <input type="text" id="account_firstname" name="account_firstname" required value="${account_firstname}">

          <label for="account_lastname">Last name:</label>
          <input type="text" id="account_lastname" name="account_lastname" required value="${account_lastname}">

          <label for="account_email">Email Address:</label>
          <input type="email" id="account_email" name="account_email" required value="${account_email}" 
          pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" 
          title="Please enter a valid email address">

          <label for="account_password">Password:</label>
          <input type="password" id="account_password" name="account_password" required 
          pattern="^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$" 
          title="Password must be at least 12 characters long and include at least one uppercase letter, one number, and one special character">

          <p class="password-info">Passwords must be a minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character.</p>

          <button type="submit" id="register-btn">Register</button>
        </form>
      </div>
    </div>
  `;
};

Util.addClassification = function (classification_name = "") {
   const addClassification =  `
      <div class="classification-box">
        <form id="classificationForm" action="/inv/add-classification" method="POST">
          <p class="required-fields"><i>New classification name cannot contain a space or special character of any kind</i></p>

          <label for="classification_name">Classification name:</label>
          <input type="text" id="classification_name" name="classification_name" required value="${classification_name}"
          pattern="^[a-zA-Z0-9]+$" title="Only letters and numbers are allowed. No spaces or special characters.">
          <button type="submit" id="register-btn">Register</button>
        </form>
      </div>
  `
  return addClassification
};


Util.addInventoryForm = async function (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  let classoptions = await inventoryModel.getClassifications()
  let classificationOptions = classoptions.rows.map(classification => `
      <option value="${classification.classification_id}" ${classification.classification_id === classification_id ? "selected" : ""}>
          ${classification.classification_name}
      </option>
  `).join("");

  return `
  <form action="/inv/add-inventory" method="POST" id="vehicleForm" onsubmit="console.log('form submitted')>
      <!-- Classification Dropdown -->
      <label for="classification_id">Classification:</label>
      <select id="classification_id" name="classification_id" required>
          ${classificationOptions}
      </select>

      <!-- Make -->
      <label for="inv_make">Make:</label>
      <input type="text" id="inv_make" name="inv_make" required value="${inv_make || ""}">

      <!-- Model -->
      <label for="inv_model">Model:</label>
      <input type="text" id="inv_model" name="inv_model" required value="${inv_model || ""}">

      <!-- Description -->
      <label for="inv_description">Description:</label>
      <textarea id="inv_description" name="inv_description" required>${inv_description || ""}</textarea>

      <!-- Image Path -->
      <label for="inv_image">Image Path:</label>
      <input type="text" id="inv_image" name="inv_image" required value="${inv_image || "/images/vehicles/no-image.png"}">

      <!-- Thumbnail Path -->
      <label for="inv_thumbnail">Thumbnail Path:</label>
      <input type="text" id="inv_thumbnail" name="inv_thumbnail" required value="${inv_thumbnail || "/images/vehicles/no-image.png"}">

      <!-- Price (No Commas) -->
      <label for="inv_price">Price:</label>
      <input type="number" id="inv_price" name="inv_price" required value="${inv_price || ""}">

      <!-- Year -->
      <label for="inv_year">Year:</label>
      <input type="number" id="inv_year" name="inv_year" required min="1900" max="2099" value="${inv_year || ""}">

      <!-- Miles -->
      <label for="inv_miles">Miles:</label>
      <input type="number" id="inv_miles" name="inv_miles" required value="${inv_miles || ""}">

      <!-- Color -->
      <label for="inv_color">Color:</label>
      <input type="text" id="inv_color" name="inv_color" required value="${inv_color || ""}">

      <button type="submit" class="submit-btn">Add Vehicle</button>
  </form>
  `;
};

Util.buildClassificationList = async function buildClassificationList() {
  try {
      const query = "SELECT classification_id, classification_name FROM classification ORDER BY classification_name";
      const result = await pool.query(query);

      if (!result.rows || result.rows.length === 0) {
          console.error("Error: No classifications found.");
          return "<p>No classifications available.</p>"; // Safe fallback
      }

      let options = `<option value="">-- Select Classification --</option>`;
      result.rows.forEach((row) => {
          options += `<option value="${row.classification_id}">${row.classification_name}</option>`;
      });

      return `<select id="classificationList" name="classification_id">${options}</select>`;
  } catch (error) {
      console.error("Error fetching classifications:", error);
      return "<p>Error loading classifications.</p>";
  }
}

Util.buildCarEditPage = async function (inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
const caredit =
   `
  <form action="/inv/update" method="POST" id="carEditForm" onsubmit="console.log('carEditForm')>
      <!-- Id-->
      <input type="hidden" id="inv_id" name="inv_id" value="${inv_id || ""}">
      
      <!-- Display Inventory ID (Read-Only) -->
      <label for="inv_id">Inventory ID:</label>
      <input type="text" id="inv_id" name="inv_id" value="${inv_id || ""}" readonly>

      <!-- Make -->
      <label for="inv_make">Make:</label>
      <input type="text" id="inv_make" name="inv_make" required value="${inv_make || ""}">

      <!-- Model -->
      <label for="inv_model">Model:</label>
      <input type="text" id="inv_model" name="inv_model" required value="${inv_model || ""}">

      <!-- Description -->
      <label for="inv_description">Description:</label>
      <textarea id="inv_description" name="inv_description" required>${inv_description || ""}</textarea>

      <!-- Image Path -->
      <label for="inv_image">Image Path:</label>
      <input type="text" id="inv_image" name="inv_image" required value="${inv_image || "/images/vehicles/no-image.png"}">

      <!-- Thumbnail Path -->
      <label for="inv_thumbnail">Thumbnail Path:</label>
      <input type="text" id="inv_thumbnail" name="inv_thumbnail" required value="${inv_thumbnail || "/images/vehicles/no-image.png"}">

      <!-- Price (No Commas) -->
      <label for="inv_price">Price:</label>
      <input type="number" id="inv_price" name="inv_price" required value="${inv_price || ""}">

      <!-- Year -->
      <label for="inv_year">Year:</label>
      <input type="number" id="inv_year" name="inv_year" required min="1900" max="2099" value="${inv_year || ""}">

      <!-- Miles -->
      <label for="inv_miles">Miles:</label>
      <input type="number" id="inv_miles" name="inv_miles" required value="${inv_miles || ""}">

      <!-- Color -->
      <label for="inv_color">Color:</label>
      <input type="text" id="inv_color" name="inv_color" required value="${inv_color || ""}">

      <button type="submit" class="submit-btn">Edit Car</button>
  </form>
  `;
  return caredit;
};

Util.buildCarDeletePage = async function (inv_id, inv_make, inv_model, inv_year, inv_price) {
  const cardelete =
     `
    <form action="/inv/delete" method="POST" id="carDeleteForm" onsubmit="console.log('carDeleteForm')>
        <!-- Id-->
        <input type="hidden" id="inv_id" name="inv_id" value="${inv_id || ""}">
        
        <!-- Display Inventory ID (Read-Only) -->
        <label for="inv_id">Inventory ID:</label>
        <input type="text" id="inv_id" name="inv_id" value="${inv_id || ""}" readonly>
  
        <!-- Make -->
        <label for="inv_make">Make:</label>
        <input type="text" id="inv_make" name="inv_make" required value="${inv_make || ""}" readonly>
  
        <!-- Model -->
        <label for="inv_model">Model:</label>
        <input type="text" id="inv_model" name="inv_model" required value="${inv_model || ""}" readonly>
  
        <!-- Year -->
        <label for="inv_year">Year:</label>
        <input type="number" id="inv_year" name="inv_year" required min="1900" max="2099" value="${inv_year || ""}" readonly>

       <!-- Price (No Commas) -->
        <label for="inv_price">Price:</label>
        <input type="number" id="inv_price" name="inv_price" required value="${inv_price || ""}" readonly>
  
        <p> Confirm Deletion - The delete is permanent. </p>

        <button type="submit" class="submit-btn">Delete Car</button>
    </form>
    `;
    return cardelete;
  };

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* 
  Check Token
*/
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/*
  Check Login
*/
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/*
  Check Login Status
*/
Util.checkLoginStatus = (req, res, next) => {
  res.locals.accountData = req.session.accountData || null;
  next();
};

Util.checkAdminAuth = (req, res, next) => {
  if (!req.session.accountData || 
     (req.session.accountData.account_type !== "Admin" && req.session.accountData.account_type !== "Employee")) {
      console.log("❌ Unauthorized Access Attempt.");
      req.flash("notice", "You must be an Admin or Employee to access Inventory Management.");
      return res.redirect("/account/accountview"); // ✅ Redirect non-admin users
  }

  console.log("✅ Access Granted - User Role:", req.session.accountData.account_type);
  next(); // ✅ Allow access to route
};

module.exports = Util