const express = require("express");
const router = express.Router();
const suppliers = require("../models/product-supplier-memory");

router.get("/", async (req, res, next) => {
	let supplierslist = await suppliers.productsupplierlist();
	res.render("pages/product-supplier", {
		title: "Product Suppliers",
		productsupplierlist: supplierslist,
		s_username: req.session.username,
	});
});

module.exports = router;
