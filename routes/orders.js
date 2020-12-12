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

router.get("/order_detail/:id", async (req, res, next) => {
	let orderid = req.params.id;
	let order = await orders.getOrderDetail(orderid);
	//console.log(order);
	res.send({ order: order, s_username: req.session.username });
});

// Create Order
router.get("/create_order", (req, res, next) => {
	res.render("pages/orderedit", {
		title: "Create Order",
		docreate: true,
		orderid: undefined,
		order_no: undefined,
		date_created: undefined,
		shipping_date: undefined,
		total_amount: undefined,
		processed_by: undefined,
		order: false,
		s_username: req.session.username,
	});
});

module.exports = router;
