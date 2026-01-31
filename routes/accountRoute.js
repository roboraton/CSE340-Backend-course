// Needed Resources
const express = require("express")
const router = new express.Router()

const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Login view route
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration view route
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Registration processing route
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router
