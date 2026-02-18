const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ************************
 * Build inventory by classificationId view
 ************************** */
invCont.buildByClassificationId = async function (req, res) {
  const classificationId = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classificationId)
  const grid = await utilities.buildClassificationGrid(data)

  let nav = await utilities.getNav()
  const className =
    data && data.length > 0
      ? data[0].classification_name
      : "Vehicles"

  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ************************
 * Build inventory detail view
 ************************** */
invCont.buildByInventory = async function (req, res) {
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

/* ************************
 * Deliver add classification view
 ************************ */
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

  if (result && result.rowCount > 0) {
    req.flash("notice", "Classification added successfully.")
    nav = await utilities.getNav()
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
    inv_make: "",
    inv_model: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_year: "",
    inv_miles: "",
    inv_color: "",
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
    inv_color,
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

  if (invResult && invResult.rowCount > 0) {
    req.flash("notice", "Inventory added successfully.")
    res.redirect("/inv")
  } else {
    let classificationList =
      await utilities.buildClassificationList(classification_id)

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
    })
  }
}

/* ***************************
 * Build delete inventory confirmation view
 *************************** */
invCont.buildDeleteInventory = async function (req, res) {
  const inv_id = req.params.inv_id
  let nav = await utilities.getNav()
  const inventory = await invModel.getInventoryByInvId(inv_id)

  const itemName = `${inventory.inv_make} ${inventory.inv_model}`

  res.render("inventory/delete-confirm", {
    title: `Delete ${itemName}`,
    nav,
    errors: null,
    inventory,
  })
}

/* ***************************
 * Carry out inventory delete
 *************************** */
invCont.deleteInventoryItem = async function (req, res) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult && deleteResult.rowCount > 0) {
    req.flash("notice", "The inventory item was successfully deleted.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

/* ***************************
 * Build edit inventory view
 *************************** */
invCont.buildEditInventory = async function (req, res) {
  const inv_id = req.params.inv_id
  let nav = await utilities.getNav()
  const inventory = await invModel.getInventoryByInvId(inv_id)

  let classificationList =
    await utilities.buildClassificationList(inventory.classification_id)

  res.render("inventory/edit-inventory", {
    title: `Edit ${inventory.inv_make} ${inventory.inv_model}`,
    nav,
    inventory,
    classificationList,
    errors: null,
  })
}

/* ***************************
 * Carry out inventory edit
 *************************** */
invCont.editInventoryItem = async function (req, res) {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body

  let nav = await utilities.getNav()

  const updateResult = await invModel.editInventoryItem(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  )

  if (updateResult && updateResult.rowCount > 0) {
    req.flash("notice", "The inventory item was successfully updated.")
    res.redirect("/inv")
  } else {
    let classificationList =
      await utilities.buildClassificationList(classification_id)

    res.render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      inventory: req.body,   //  esto permite sticky
      classificationList,
      errors: null,
    })
  }
}


module.exports = invCont
