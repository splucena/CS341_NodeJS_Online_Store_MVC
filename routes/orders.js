const express = require("express");
const router = express.Router();
const orders = require("../models/orders-memory");

router.get("/", async (req, res, next) => {
	let orderlist = await orders.orderlist();
	res.render("pages/orders", {
		title: "Orders",
		orderlist: orderlist,
		s_username: req.session.username,
	});
});

module.exports = router;
