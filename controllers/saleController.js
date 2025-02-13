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
        res.render("sale/sale-car", { clients, classifications, cars: [], selectedCar: null, title: "Car Sale", nav });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

exports.getCarsByClassification = async (req, res) => {
    const { classificationId } = req.params;
    try {
        const cars = await saleModel.getAvailableCars(classificationId);
        res.json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
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