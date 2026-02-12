const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name must not contain spaces or special characters."),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name,
    })
    return
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("inv_make").trim().escape().notEmpty().withMessage("Maker is required."),
    body("inv_model").trim().escape().notEmpty().withMessage("Model is required."),
    body("inv_description").trim().escape().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."), // No se usa .escape() porque es una ruta de archivo.
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."), // Escapar convertiría los "/" en entidades HTML y rompería la URL.
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a valid number greater than 0."),
    body("inv_year").isInt({ min: 1800, max: 2100 }).withMessage("Year must be a valid integer between 1800 and 2100."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a valid integer greater than or equal to 0."),
    body("inv_color").trim().escape().notEmpty().withMessage("Color is required."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const { classification_id } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors,
      ...req.body, // ← stickiness 🔥
    })
    return
  }
  next()
}


module.exports = validate
