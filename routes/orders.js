const express = require("express");
const router = express.Router();
const orders = require("../models/orders-memory");
const customers = require("../models/customers-memory");
const users = require("../models/users-memory");
const products = require("../models/product-product-memory");

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
router.get("/create_order", async (req, res, next) => {
	const order_status = [
		["draft", "Draft"],
		["processing", "Processing"],
		["in_transit", "In Transit"],
		["delivered", "Delivered"],
		["cancelled", "Cancelled"],
	];
	let customerlist = await customers.customerlist();
	let userslist = await users.userlist();
	let productslist = await products.productproductlist();

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
		customerlist: customerlist,
		userlist: userslist,
		order_status: order_status,
		productslist: productslist,
		s_username: req.session.username,
	});
});

// Save Order
router.post("/save_order", (req, res, next) => {
	const operation = req.body.docreate;
	const order_no = req.body.order_no;
	const order_status = req.body.order_status;
	const customer_id = req.body.customers;
	const user_id = req.body.users;
	const total_amount = req.body.total_amount;
	const create_date = req.body.date_created;
	const shipping_date = req.body.shipping_date;
	/*console.log([
		req.body,
		operation,
		order_no,
		order_status,
		customer_id,
		user_id,
		total_amount,
		create_date,
		shipping_date,
	]);*/

	console.log(req.body);

	let order = null;
	// save order
	if (operation === "create") {
		/*order = orders.create({
			order_no: order_no,
			order_status: order_status,
			customer_id: customer_id,
			user_id: user_id,
			total_amount: total_amount,
			create_date: create_date,
			shipping_date: shipping_date,
		});*/
	} else {
		// update order
	}

	res.redirect("/orders/create_order");
});

module.exports = router;
