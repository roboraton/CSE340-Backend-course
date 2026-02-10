// Nedded Resources
const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const utilities = require("../utilities/")

const invValidate = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory detail view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventory))

// Inventory management view
router.get("/",utilities.handleErrors(invController.buildManagement))

// Add classification view
router.get("/add-classification",utilities.handleErrors(invController.buildAddClassification))

// Post route to add classification
router.post("/add-classification",invValidate.classificationRules(),invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification))

// Add inventory view
router.get("/add-inventory",utilities.handleErrors(invController.buildAddInventory))

// Post route to add inventory
router.post("/add-inventory",invValidate.inventoryRules(),invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory))

// Get route for delete inventory view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory))

// Post route to delete inventory
router.post("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryItem))

// Call to deliver delete confirmation view
router.get("/delete-confirmation",utilities.handleErrors(invController.buildDeleteConfirmation))

module.exports = router;