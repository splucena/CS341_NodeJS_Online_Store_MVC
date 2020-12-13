const express = require("express");
const router = express.Router();
const products = require("../models/product-product-memory");

router.get("/", async (req, res, next) => {
	let productslist = await products.productproductlist();
	res.render("pages/product-product", {
		title: "Products",
		productproductlist: productslist,
		s_username: req.session.username,
	});
});

router.get("/product_detail/:id", async (req, res, next) => {
	let product_id = req.params.id;
	let product = await products.getProductDetail(product_id);
	res.send({ product: product });
});

module.exports = router;
