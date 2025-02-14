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


exports.processSale = async (req, res) => {
    const { carId, clientId, taxRate, totalPrice } = req.body;
    const employeeId = req.session.user.id;

    try {
        await saleModel.processSale(carId, clientId, taxRate, totalPrice, employeeId);
        res.json({ success: true, message: "Invoice processed successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error processing invoice" });
    }
};

module.exports = exports