const utilities = require("../utilities");
const { validationResult } = require("express-validator");
const classificationModel = require('../models/classification-model')
const inventoryModel = require("../models/inventory-model");

const invMgm = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invMgm.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await inventoryModel.getInventoryByClassificationId(classification_id)
  if (!data || data.length === 0) {
    // 🔹 Set a flash message
    req.flash("notice", "No inventory found for this classification.");
    // 🔹 Redirect back to the previous page (or inventory management)
    return res.redirect("back"); // Redirects the user to the previous page
}
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
invMgm.buildCarDetail = async function (req, res, next) {
  try {
    // Get the car ID from the request parameters
    const car_id = req.params.invId;

    // Fetch car details from the database
    const carData = await inventoryModel.getCarDetailById(car_id);

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

invMgm.buildManagementView = async function (req, res, next) {
    try {
        const flashMessage = req.flash("notice")
                
        // Fetch navigation menu inside the function
        const nav = await utilities.getNav();
        const classificationSelect = await utilities.buildClassificationList()
        res.render("inventory/management", {
            
            title: "Vehicle Management",
            nav,
            flashMessage,
            classificationSelect
        });
    } catch (error) {
        console.error("Error in InventoryManagement:", error);
        next(error);
    }
};


// Function to add classification
invMgm.addClassification = async function (req, res)  {
     // Fetch navigation menu inside the function
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
        nav,
        title: "Add New Classification",
        flashMessage:req.session.flashMessage || null,
        errors:[],
        addClassification: utilities.addClassification("")
    
    });
};

invMgm.processClassification = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("inventory/add-classification", {
            title: "Add New Classification",
            flashMessage: "Please fix the errors below.",
            errors: errors.array(),
            addClassification: utilities.addClassification(req.body.classification_name || "")
        });
    }

    try {
        const { classification_name } = req.body;
        // Ensure classification_name is not undefined
        if (!classification_name) {
            throw new Error("Classification name is undefined.");
        }

        // ✅ Properly await the database insertion
        const regResult = await classificationModel.registerNewClassification(classification_name);
        
        if (regResult) {
            req.session.flashMessage = "Classification successfully added!";
            return res.status(201).redirect("/inv/");
        } else {
            throw new Error("Database insertion failed.");
        }
    } catch (error) {
            return res.render("inventory/add-classification", {
            title: "Add New Classification",
            flashMessage: "An error occurred while saving.",
            errors: [],
            addClassification: utilities.addClassification(req.body.classification_name || "")
        });
    }
};

// Function to add a vehicle

invMgm.addInventory = async function (req, res)  {
        // Fetch navigation menu inside the function
       const nav = await utilities.getNav();
       const addInventory = await utilities.addInventoryForm();
     
       res.render("inventory/add-inventory", {
           nav,
           title: "Add New Inventory",
           flashMessage:req.session.flashMessage || null,
           errors:[],
           addInventory
       });
   };

invMgm.processInventory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("❌ Validation errors:", errors.array());
        return res.render("inventory/add-inventory", {
            title: "Add New Inventory",
            flashMessage: "Please fix the errors below.",
            errors: errors.array(),
            addInventory: utilities.addInventoryForm(req.body)
        });
    }

    try {
        // Log incoming request data
        console.log("📌 Received Inventory Data:", req.body);
         // Extract all required fields from the form
         const {
            classification_id, inv_make, inv_model, inv_year,
            inv_description, inv_image, inv_thumbnail, inv_price,
            inv_miles, inv_color
        } = req.body;

        // ✅ Properly await the database insertion
        const regResult = await inventoryModel.registerNewInventory(
            classification_id, inv_make, inv_model, inv_year,
            inv_description, inv_image, inv_thumbnail, inv_price,
            inv_miles, inv_color
        );

        if (regResult) {
            req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`);
            return res.status(201).redirect("/inv/");
        } else {
            throw new Error("Database insertion failed.");
        }
    } catch (error) {
        console.error("Error processing inventory:", error);

        return res.render("inventory/add-inventory", {
            title: "Add New Inventory",
            flashMessage: "An error occurred while saving.",
            errors: [],
            addInventory: utilities.addInventoryForm(req.body) // Pass back user input
        });
    }
};


/*
  Return Inventory by Classification As JSON
*/

invMgm.getInventoryJSON = async (req, res, next) => {
    try {
        const classification_id = parseInt(req.params.classification_id);
        const invData = await inventoryModel.getInventoryByClassificationId(classification_id);

        if (invData.length > 0) {
            return res.json(invData);
        } else {
            return res.status(404).json({ error: "No inventory found." });
        }
    } catch (error) {
        console.error("Error fetching inventory:", error);
        next(error);
    }
};

invMgm.editInventoryById = async (req, res, next) => {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("❌ Validation errors:", errors.array());
        return res.render("./inventory/car-edit", {
            title: "Edit",
            flashMessage: "Please fix the errors below.",
            errors: errors.array(),
        });
    }
    const itemData = await inventoryModel.getCarDetailById(inv_id)
    console.log(itemData)
    const caredit = await utilities.buildCarEditPage(
        itemData.inv_id, itemData.inv_make, itemData.inv_model, itemData.inv_year, itemData.inv_description, itemData.inv_image, itemData.inv_thumbnail, itemData.inv_price, itemData.inv_miles, itemData.inv_color)
    console.log("Classification_id: " + itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/car-edit", {
        title: "Edit " + itemName,
        nav,
        errors: errors,
        caredit
    })
} 

// Function to update a vehicle

invMgm.updateInventory = async function (req, res, next)  {
    // Fetch navigation menu inside the function
   const nav = await utilities.getNav();
   const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body
  const updateResult = await inventoryModel.updateInventoryById(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  )
 if (updateResult) {
    const itemName = inv_make + " " + inv_model
    console.log(`✅ Flash message set: The ${itemName} was successfully updated.`);
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
    
  } else {
    const errors = validationResult(req);
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const caredit = await utilities.buildCarEditPage(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/car-edit", {
    title: "Edit " + itemName,
    nav,
    errors,
    classificationSelect: classificationSelect,
    caredit
    })
  }
}

/*
   Delete car view Page
*/

invMgm.deleteInventoryById = async (req, res, next) => {
    try {
        const inv_id = parseInt(req.params.invId);
        let nav = await utilities.getNav();
        
        // ✅ Ensure errors is always an array
        let errors = validationResult(req);
        errors = errors.isEmpty() ? [] : errors.array();

        // ✅ Fetch the car details from database
        const itemData = await inventoryModel.getCarDetailById(inv_id);
        
        if (!itemData) {
            req.flash("error", "Vehicle not found.");
            return res.redirect("/inv/");
        }

        const cardelete = await utilities.buildCarDeletePage(
            itemData.inv_id, 
            itemData.inv_make, 
            itemData.inv_model, 
            itemData.inv_year, 
            itemData.inv_price
        );

        const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

        res.render("./inventory/car-delete", {
            title: "Delete " + itemName,
            nav,
            errors,  // ✅ Always an array, avoids "null.length" error
            cardelete
        });

    } catch (error) {
        console.error("Error in deleteInventoryById:", error);
        req.flash("error", "An error occurred while fetching vehicle details.");
        return res.redirect("/inv/");
    }
};


// Function to delete a vehicle

invMgm.deleteInventory = async function (req, res, next)  {
    try {
        console.log("Parameters: " + req.body)
        const inv_id = req.body.inv_id;

        // ✅ Get item details before deleting to retain `inv_make` and `inv_model`
        const itemData = await inventoryModel.getCarDetailById(inv_id);
        console.log(itemData)
        if (!itemData) {
            req.flash("error", "Vehicle not found.");
            return res.redirect("/inv/");
        }

        const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

        // ✅ Perform the delete operation
        const deleteResult = await inventoryModel.deleteInventoryById(inv_id);

        if (deleteResult) {
            // ✅ Store a success flash message
            req.flash("notice", `The ${itemName} was successfully deleted.`);
        } else {
            throw new Error("Delete operation failed.");
        }
        return res.redirect("/inv/");
    } catch (error) {
        console.error("Error deleting inventory:", error);
        req.flash("error", "An error occurred while deleting the vehicle.");
        return res.render("inventory/car-delete", {
            title: "Delete Vehicle",
            nav: await utilities.getNav(),
            errors: [],  // ✅ Fix: Always pass an empty array
            itemData: null
        });
    }
};


module.exports = invMgm;
