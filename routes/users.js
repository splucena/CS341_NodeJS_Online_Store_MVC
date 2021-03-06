const express = require("express");
const router = express.Router();
const users = require("../models/users-memory");

router.get("/", async (req, res, next) => {
	//res.setHeader("Content-Type", "text/html");
	let userslist = await users.userlist();
	res.render("pages/users", {
		title: "Users",
		userslist: userslist,
		s_username: req.session.username,
	});
});

router.get("/user_detail/:id", async (req, res, next) => {
	let userid = req.params.id;
	let user = await users.getUserDetail(userid);
	res.send({ user: user });
});

/* Add User. */
router.get("/add_user", (req, res, next) => {
	res.render("pages/useredit", {
		title: "Add a User",
		docreate: true,
		userid: undefined,
		first_name: undefined,
		last_name: undefined,
		username: undefined,
		password: undefined,
		user: false,
	});
});

// Create User
router.post("/save_user", async (req, res, next) => {
	let user;
	if (req.body.docreate === "create") {
		user = await users.create(
			null,
			req.body.first_name,
			req.body.last_name,
			req.body.username,
			req.body.passwd
		);
	} else {
		user = await users.update(
			req.body.userid,
			req.body.first_name,
			req.body.last_name,
			req.body.username,
			req.body.passwd
		);
	}

	//res.redirect("/users/user_view?userid=" + user.userid);
	res.redirect("/users");
});

// Read User
router.get("/user_view", async (req, res, next) => {
	console.log(req.query.userid);
	let user = await users.read(req.query.userid);

	console.log(user.user);

	res.render("pages/userview", {
		title: user ? user.userid : user.user_id,
		userid: user ? user.userid : user.user_id,
		username: req.query.username,
		password: req.query.password,
		user: user,
	});
});

// Edit User
router.get("/user_edit", async (req, res, next) => {
	//let user = await users.read(req.query.userid);
	let user = await users.getUserDetail(req.query.userid);
	//console.log(user);
	res.render("pages/useredit", {
		title: user ? "Edit " + user[0].userid : "Add a USer",
		docreate: false,
		//userid: req.query.userid,
		userid: user[0].userid,
		user: user[0],
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

// Confirm delete user
router.post("/users_delete", async (req, res, next) => {
	await users.destroy(req.body.userid);
	res.redirect("/users");
});

module.exports = router;
