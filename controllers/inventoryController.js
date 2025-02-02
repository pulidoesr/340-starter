const utilities = require("../utilities");
const { validationResult } = require("express-validator");
const classificationModel = require('../models/classification-model')

const invMgm = {};

invMgm.InventoryManagement = async function (req, res, next) {
    try {
        const flashMessage = req.session.flashMessage || null;
        req.session.flashMessage = null; // Clear message after displaying
        
        // Fetch navigation menu inside the function
        const nav = await utilities.getNav();

        res.render("inventory/management", {
            flashMessage,
            title: "Vehicle Management",
            nav
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
    console.log("📌 Rendering view: inventory/add-classification"); // ✅ Debug Log
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
        console.log("❌ Validation Errors:", errors.array());
        return res.render("inventory/add-classification", {
            title: "Add New Classification",
            flashMessage: "Please fix the errors below.",
            errors: errors.array(),
            addClassification: utilities.addClassification(req.body.classification_name || "")
        });
    }

    try {
        const { classification_name } = req.body;
        console.log(`✅ Attempting to save classification: ${classification_name}`);

        // Ensure classification_name is not undefined
        if (!classification_name) {
            throw new Error("Classification name is undefined.");
        }

        // ✅ Properly await the database insertion
        const regResult = await classificationModel.registerNewClassification(classification_name);
        
        if (regResult) {
            console.log("✅ Classification successfully saved to the database.");
            req.session.flashMessage = "Classification successfully added!";
            return res.status(201).redirect("/inv/");
        } else {
            throw new Error("Database insertion failed.");
        }
    } catch (error) {
        console.error("❌ Error saving classification:", error.message);
          return res.render("inventory/add-classification", {
            title: "Add New Classification",
            flashMessage: "An error occurred while saving.",
            errors: [],
            addClassification: utilities.addClassification(req.body.classification_name || "")
        });
    }
};

// Function to add a vehicle
invMgm.addVehicle = (req, res) => {
    req.session.flashMessage = "Redirecting to add vehicle...";
    res.redirect("/inv/");
};

module.exports = invMgm;
