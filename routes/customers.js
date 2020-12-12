const express = require("express");
const router = express.Router();
const customers = require("../models/customers-memory");

router.get("/", async (req, res, next) => {
	let customerlist = await customers.customerlist();
	res.render("pages/customers", {
		title: "Customers",
		customerlist: customerlist,
		s_username: req.session.username,
	});
});

module.exports = router;
