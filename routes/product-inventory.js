const express = require("express");
const router = express.Router();
const inventory = require("../models/product-inventory-memory");

router.get("/", async (req, res, next) => {
	let inventorylist = await inventory.productinventorylist();
	res.render("pages/product-inventory", {
		title: "Product Inventory",
		productinventorylist: inventorylist,
		s_username: req.session.username,
	});
});

module.exports = router;
