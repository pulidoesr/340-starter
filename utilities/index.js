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
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util