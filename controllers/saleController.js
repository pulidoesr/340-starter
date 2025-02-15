const saleModel = require("../models/sale-model");
const utilities = require('../utilities')




exports.getSalePage = async (req, res) => {
    const accountData = req.session.accountData;
    const account_type = String(accountData.account_type).trim()
    if (!account_type || account_type !== "Employee" && account_type !== "Admin") {
        return res.redirect("/account");
    }

    try {
        const clients = await saleModel.getClients();
        const classifications = await saleModel.getClassifications();
        let nav = await utilities.getNav()
        res.render("sale/sale-car", {
            nav, 
            title: "Car Sale", 
            clients, 
            classifications, 
            cars: [], 
            selectedClient: "",
            selectedClassification: "",
            selectedCar: null,       
          });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

exports.getCarsByClassification = async (req, res) => {
    try {
        console.log("Received request for classification ID:", req.params.classificationId); // ✅ Debugging log

        const classificationId = req.params.classificationId;
        if (!classificationId || classificationId === "undefined") {
            return res.status(400).json({ error: "Classification ID is required." });
        }

        // ✅ Ensure `getAvailableCars()` properly handles errors
        const cars = await saleModel.getAvailableCars(classificationId);

        // ✅ Prevent sending multiple responses
        return res.json(cars);

    } catch (error) {
        console.error("Error fetching available cars:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Error fetching cars" });
        }
    }
};

exports.getCarDetails = async (req, res) => {
    try {
        const carId = req.params.carId;
        if (!carId || carId === "undefined") {
            return res.status(400).json({ error: "Car ID is required." });
        }

        const car = await saleModel.getCarById(carId);

        if (!car) {
            return res.status(404).json({ error: "Car not found." });
        }
        console.log("Car details controller:", car)
        return res.json(car); // ✅ Ensure JSON response

    } catch (error) {
        console.error("Error fetching car details:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Error fetching car details." });
        }
    }
};

exports.processSale = async (req, res) => {
    try {
        console.log("Received sale request:", req.body); // ✅ Debugging log
         // ✅ Retrieve employeeId from session
         const accountData = req.session.accountData;
         const employeeId = accountData?.account_id; // ✅ Get logged-in user ID
         if (!employeeId) {
            console.error("❌ Error: Employee ID is missing in session.");
            return res.status(403).json({ error: "Unauthorized: Employee ID not found." });
        }

        const { carId, clientId, carPrice, discount, taxRate, taxAmount, totalPrice} = req.body;

        if (!carId || !clientId || !carPrice || !taxRate || !taxAmount || !totalPrice) {
            console.error("❌ Missing required fields:", req.body);
            return res.status(400).json({ error: "Missing required fields in request." });
        }

        const invoiceId = await saleModel.processSale(carId, clientId, carPrice, discount, taxRate, taxAmount, totalPrice, employeeId);
           // ✅ Store flash message in session before redirecting
           req.session.flashMessage = { 
            type: "success", 
            message: `✅ Sale processed successfully! Invoice #${invoiceId} has been created.`
    } 
        // ✅ Return JSON instead of redirecting
         return res.json({ success: true, invoiceId, redirectUrl: "/account/accountview" });
    } catch (error) {
        console.error("❌ Error processing sale:", error);

        req.session.flashMessage = { 
            type: "error", 
            message: "Error processing sale. Please try again."
        };

        return res.redirect("/sale");  // ✅ Redirects back to sale page with error message
    }
};

module.exports = exports