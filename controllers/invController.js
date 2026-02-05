const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ************************
 * Build inventory by classificationId view
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classificationId = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classificationId)
  const grid = await utilities.buildClassificationGrid(data)

  let nav = await utilities.getNav()
  const className = data[0].classification_name

  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ************************
 * Build inventory detail view
 ************************** */

invCont.buildByInventory = async function (req, res, next) {
  const inv_id = req.params.inv_id
  
  const data = await invModel.getInventoryByInvId(inv_id)

  const nav = await utilities.getNav()

  res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    vehicle: data,
  })
}

/* ************************
 * Inventory management view
 ************************ */
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ************************
 * Add classification
 ************************ */

invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully.")
    nav = await utilities.getNav() // 🔥 navbar actualizado
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Classification add failed.")
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ************************
 * Deliver add inventory view
 ************************ */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

/* ************************
 * Add inventory
 ************************ */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body

const invResult = await invModel.addInventory(
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
)


  if (invResult && invResult.rows && invResult.rows.length > 0) {
    req.flash("notice", "Inventory added successfully.")
    res.redirect("/inv")
  }
   else {let classificationList =
      await utilities.buildClassificationList(classification_id)

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
    })
  }
}



module.exports = invCont