const utilities = require("../utilities");
const { validationResult } = require("express-validator");
const classificationModel = require('../models/classification-model')
const inventoryModel = require("../models/inventory-model");

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

        // Ensure required fields are not empty
        if (!classification_id || !inv_make || !inv_model || !inv_year || !inv_price) {
            console.error("❌ Missing required fields");
            throw new Error("Missing required fields.");
        }
        console.log("📌 Received Inventory Data:", req.body);

        // ✅ Properly await the database insertion
        const regResult = await inventoryModel.registerNewInventory(
            classification_id, inv_make, inv_model, inv_year,
            inv_description, inv_image, inv_thumbnail, inv_price,
            inv_miles, inv_color
        );

        if (regResult) {
            req.session.flashMessage = "Inventory successfully added!";
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

module.exports = invMgm;
