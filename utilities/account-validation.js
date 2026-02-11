const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/* ************************
* Registration Data Validation Rules
* ************************ */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const existingEmail = await accountModel.checkExistingEmail(account_email)
        if (existingEmail) {
          throw new Error("Email exists. Please log in or use different email.")
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ************************
* Check registration data
* ************************ */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* ************************
* Login validation rules
* ************************ */
validate.loginRules = () => {
  return [
    body("account_email")
      .isEmail()
      .withMessage("Please provide a valid email."),
    body("account_password")
      .notEmpty()
      .withMessage("Password is required.")
  ]
}

/* ************************
* Check login data
* ************************ */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email: req.body.account_email,
    })
  }
  next()
}

/* ************************
* Update account validation rules
* ************************ */
validate.updateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail()
  ]
}

/* ************************
*  Check update account data
* ************************
*/
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      accountData: req.body
    })
  }
  next()
}

/* ************************
* Password validation rules
* ************************ */
validate.passwordRules = () => {
  return [
    body("account_password")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements.")
  ]
}

/* ************************
*  Check password data
* ************************ */
validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors
    })
  }
  next()
}

module.exports = validate
