const util = require("util");
var express = require("express");
var router = express.Router();
const users = require("../models/users-memory");
const { notStrictEqual } = require("assert");

/* Add User. */

router.get("/add_user", (req, res, next) => {
	res.render("pages/useredit", {
		title: "Add a User",
		docreate: true,
		userid: "",
		username: undefined,
		password: undefined,
	});
});

router.post("/save_user", async (req, res, next) => {
	let user;
	if (req.body.docreate === "create") {
		user = await users.create(
			req.body.userid,
			req.body.username,
			req.body.password
		);
	} else {
		user = await users.update(
			req.body.userid,
			req.body.username,
			req.body.password
		);
	}

	console.log("save user AAAAAAAA");
	console.log(req.body.userid);

	res.redirect("/users/user_view?userid=" + req.body.userid);
});

// Read User
router.get("/user_view", async (req, res, next) => {
	console.log(req.query.userid);
	let user = await users.read(req.query.userid);
	res.render("pages/userview", {
		title: user ? user.userid : "",
		userid: user.userid,
		username: req.query.username,
		password: req.query.password,
		user: user,
	});
});

module.exports = router;
