const express = require("express");
const router = express.Router();
const categories = require("../models/product-category-memory");

router.get("/", async (req, res, next) => {
	let productcategorylist = await categories.productcategorylist();
	res.render("pages/product-category", {
		title: "Product Category",
		productcategorylist: productcategorylist,
		s_username: req.session.username,
	});
});

module.exports = router;
