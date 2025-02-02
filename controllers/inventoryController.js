const utilities = require("../utilities");

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
invMgm.addClassification = (req, res) => {
    req.session.flashMessage = "Redirecting to add classification...";
    res.redirect("/inv/");
};

// Function to add a vehicle
invMgm.addVehicle = (req, res) => {
    req.session.flashMessage = "Redirecting to add vehicle...";
    res.redirect("/inv/");
};

module.exports = invMgm;
