const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " carDatas",
    nav,
    grid,
  })
}

/* ***************************
 *  Build car detail view
 * ************************** */
invCont.buildCarDetail = async function (req, res, next) {
  try {
    // Get the car ID from the request parameters
    const car_id = req.params.invId;

    // Fetch car details from the database
    const carData = await invModel.getCarDetailById(car_id);

    // Check if carData exists
    if (!carData) {
      return res.status(404).render("error", {
        title: "Car Not Found",
        message: "The car you are looking for does not exist.",
      });
    }

    // Fetch navigation menu
    const nav = await utilities.getNav();

    // Build the car details HTML or any required data format
    const carDetails = await utilities.buildCarDetailPage(carData);

    console.log("carDetails being passed to template:", carDetails);


    // Render the car detail view with required data
    res.render("./inventory/car-detail", {
      title: `${carData.inv_make} ${carData.inv_model} Details`,
      nav,
      carDetails,
    });
  } catch (err) {
    // Log the error and render an error page
    console.error("Error building car detail view:", err);
    next(err);
  }
};

module.exports = invCont
