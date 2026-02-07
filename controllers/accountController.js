const utilities = require("../utilities/")
const accountController = {}
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
// Connect-flash NO se requiere aquí, ya está cargado como middleware en server.js

/* ************************
 * Deliver login view
 ************************ */
accountController.buildLogin = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ************************
 * Deliver registration view
 ************************ */
accountController.buildRegister = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    errors: null,
    title: "Register",
    nav,
  })
}

/* ************************
 * Process registration
 ************************ */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Primero se hace el hash del password, NUNCA se guarda en texto plano
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  // Ahora sí se guarda el usuario usando el password hasheado
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ************************
 * Process login request
 ************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 360 * 1000 }) // 6 hours
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 360 * 1000 }) // 6 hours
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ************************
 * Deliver account management view
 ************************ */
accountController.buildAccount = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("account/logged", {
    title: "Account",
    nav,
    errors: null,
  })
}


module.exports =  accountController
