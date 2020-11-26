const util = require("util");
var express = require("express");
var router = express.Router();
const users = require("../models/users-memory");
const { notStrictEqual, notEqual } = require("assert");
const { AsyncLocalStorage } = require("async_hooks");

/* Add User. */

router.get("/add_user", (req, res, next) => {
	res.render("pages/useredit", {
		title: "Add a User",
		docreate: true,
		userid: "",
		username: undefined,
		password: undefined,
		user: false,
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

// Edit User
router.get("/user_edit", async (req, res, next) => {
	let user = await users.read(req.query.userid);
	res.render("pages/useredit", {
		title: user ? "Edit " + user.userid : "Add a USer",
		docreate: false,
		userid: req.query.userid,
		user: user,
	});
});

// Delete user
router.get("/user_destroy", async (req, res, next) => {
	let user = await users.read(req.query.userid);
	res.render("pages/userdestroy", {
		title: user ? user.userid : "",
		userid: req.query.userid,
		user: user,
	});
});

//
router.post("/users_dc", async (req, res, next) => {
	console.log("bbbbbbbbbbbb");
	await users.destroy(req.body.userid);
	res.redirect("/");
});

module.exports = router;
