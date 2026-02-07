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

// Process the reguistration data
router.post("/register",regValidate.registrationRules(),regValidate.checkRegData,
utilities.handleErrors(accountController.registerAccount))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(), regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get(
  "/", 
  utilities.checkJWTToken, 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccount))

module.exports = router
