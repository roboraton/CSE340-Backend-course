// Needed Resources
const express = require("express")
const router = new express.Router()

const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

const regValidate = require("../utilities/account-validation")

// Login view route
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration view route
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Registration processing route
router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the reguistration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
        res.status(200).send('login process')
    }
)

module.exports = router
