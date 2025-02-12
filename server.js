/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const path = require("path");
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const saleRoute = require("./routes/saleRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: { 
    httpOnly: true,  // 🔐 Helps prevent XSS attacks
    secure: false,   // ❌ Set `true` only for HTTPS
    maxAge: 3600000  
}
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(utilities.checkJWTToken)
app.use(express.static(path.join(__dirname, "public/js")));
app.use(utilities.checkLoginStatus);
app.use((req, res, next) => {
  res.locals.accountData = req.session.accountData || null;
  next();
});



// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not a views root

/* ***********************
 * Routes
 *************************/
app.use(static)


// Account routes
app.use("/account", accountRoute)

// Inventory Management route
app.use("/inv", inventoryRoute)

// Sale route
app.use("/sale", saleRoute);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome)) 

// Basic error handling
app.post("/error-log", (req, res) => {
  console.error("Client-side error logged:", req.body);
  res.status(200).json({ message: "Error logged successfully" });
});


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
   next({status: 404, message: 'Sorry, we appear to have lost that page.'})
 })

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})


app.all("*", (req, res) => {
  console.log("Unhandled route:", req.method, req.url);
  res.status(404).send("Route not found.");
});





