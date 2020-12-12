const express = require("express");
const router = express.Router();
const users = require("../models/customers-memory");

router.get("/", async (req, res, next) => {
	let customerlist = await users.customerlist();
	res.render("pages/customers", {
		title: "Customers",
		customerlist: customerlist,
		s_username: req.session.username,
	});
});
