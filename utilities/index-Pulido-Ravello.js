const path = require('path')
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
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

  // Sign-up Link
  loginPage += "<p>No account? <a href=\"/account/register\">register</a></p>";

  loginPage += "</div>"; // Close login-box
  loginPage += "</div>"; // Close login-container

  return loginPage;
};

Util.buildRegisterPage = function() {
  let registerPage = "<div class=\"register-container\">";
  registerPage += "<div class=\"register-box\">";

 // Start Form
registerPage += "<form id=\"registerForm\" action=\"/account/register\" method=\"POST\">";

// Required Fields Notice
registerPage += "<p class=\"required-fields\"><i>All fields are required.</i></p>";

// First Name
registerPage += "<label for=\"account_firstname\">First name:</label>";
registerPage += "<input type=\"text\" id=\"account_firstname\" name=\"account_firstname\" required>";

// Last Name
registerPage += "<label for=\"account_lastname\">Last name:</label>";
registerPage += "<input type=\"text\" id=\"account_lastname\" name=\"account_lastname\" required>";

// Email
registerPage += "<label for=\"account_email\">Email Address:</label>";
registerPage += "<input type=\"email\" id=\"account_email\" name=\"account_email\" required pattern=\"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\" title=\"Please enter a valid email address\">";

// Password
registerPage += "<label for=\"account_password\">Password:</label>";
registerPage += "<input type=\"password\" id=\"account_password\" name=\"account_password\" required pattern=\"^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$\" title=\"Password must be at least 12 characters long and include at least one uppercase letter, one number, and one special character\">";

// Password Policy
registerPage += "<p class=\"password-info\">Passwords must be a minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character.</p>";

// Register Button
registerPage += "<button type=\"submit\" id=\"register-btn\">Register</button>";

// Close Form
registerPage += "</form>";

// JavaScript for Extra Validation
registerPage += `
<script>
   document.addEventListener("DOMContentLoaded", function() {
    // Ensure the correct form is targeted
    const form = document.getElementById("registerForm");

    if (form) {
      form.setAttribute("novalidate");

      form.addEventListener("submit", function(event) {
        const firstName = document.getElementById("account_firstname").value.trim();
        const lastName = document.getElementById("account_lastname").value.trim();
        const email = document.getElementById("account_email").value.trim();
        const password = document.getElementById("account_password").value;

        // Corrected Email Regex Pattern
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Corrected Password Requirements
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

        // Validate Email Format
        if (!emailPattern.test(email)) {
          alert("Please enter a valid email address.");
          event.preventDefault();
          return;
        }

        // Validate Password Strength
        if (!passwordPattern.test(password)) {
          alert("Password must be at least 12 characters long and include at least one uppercase letter, one number, and one special character.");
          event.preventDefault();
          return;
        }
      });
    }
  });
</script>`;

registerPage += "</div>"; // Close register-box
registerPage += "</div>"; // Close register-container
return registerPage;
};






/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util