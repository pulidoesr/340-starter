const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
    try {
        console.log("🔍 Checking Auth for:", req.originalUrl);
        if (!req.session.accountData) {
            console.log("❌ No session found in checkAuth.");
            req.flash("notice", "You must be logged in to access this page.");
            return res.redirect("/account/login"); // ✅ Stops execution
        }

        // Get the JWT from cookies
        const token = req.cookies.jwt;
        if (!token) {
            req.flash("notice", "You must be logged in to access this page.");
            return res.redirect("/account/login");
        }

        // Verify the JWT
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded || !decoded.account_type) {
            req.flash("notice", "Invalid authentication.");
            return res.redirect("/account/login");
        }

         // Check if user is authorized (Only 'Employee' or 'Admin' allowed)
         if (decoded.account_type === "Client") {
            return res.render("/account/update-account")
        }

        // Check if user is authorized (Only 'Employee' or 'Admin' allowed)
        if (decoded.account_type !== "Employee" && decoded.account_type !== "Admin") {
            req.flash("notice", "Unauthorized access.");
            return res.redirect("/account/accountview");
        }

        // Store user data in request
        req.account = decoded;
        next(); // Continue to next middleware or route
    } catch (error) {
        console.error("Auth Error:", error);
        req.flash("notice", "Invalid authentication.");
        return res.redirect("/account/login");
    }
}

module.exports = checkAuth;
