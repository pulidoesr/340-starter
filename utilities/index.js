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
  loginPage += "<input type=\"email\" id=\"email\" name=\"email\" required>";

  // Password Input
  loginPage += "<label for=\"password\">Password:</label>";
  loginPage += "<input type=\"password\" id=\"password\" name=\"password\" required>";
  
  // Password Policy Info
  loginPage += "<p class=\"password-info\">Passwords must be minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character.</p>";
  
  // Show Password Button
  loginPage += "<button type=\"button\" id=\"show-password\" onclick=\"togglePassword()\">Show Password</button>";

  // Login Button
  loginPage += "<button type=\"submit\" id=\"login-btn\">Login</button>";

  // Sign-up Link
  loginPage += "<p>No account? <a href=\"/signup\">Sign-up</a></p>";

  loginPage += "</div>"; // Close login-box
  loginPage += "</div>"; // Close login-container

  return loginPage;
};

// JavaScript to Toggle Password Visibility
function togglePassword() {
  let passwordInput = document.getElementById("password");
  if (passwordInput.type === "password") {
      passwordInput.type = "text";
  } else {
      passwordInput.type = "password";
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util