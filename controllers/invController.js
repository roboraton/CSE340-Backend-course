const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ************************
 * Build inventory by classificationId view
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classificationId = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildInventoryGrid(data)
  let nav = await utilities.getNav()
  const className = data [0].classification_name
  res.render("inventory/classification-view", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = invCont