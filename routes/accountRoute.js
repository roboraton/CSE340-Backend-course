// Needed Resources
const express = require("express")
const router = new express.Router()

const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Login view route
router.get("/login", utilities.handleErrors(accountController.buildLogin)
)

module.exports = router
