var express = require("express");
var session = require("express-session");
var router = express.Router();
const users = require("../models/users-memory");

let sess; // global session

// Custom middlewares
function logRequest(req, res, next) {
	console.log("Received a request for: " + req.url);
	next();
}

async function verifyLogin(req, res, next) {
	let success, sess;
	//sess = req.session;
	console.log(req.session);
	success = await users.logout(req);

	if (success.success) {
		console.log(success);
		next();
		//res.redirect("/");
	} else {
		let result = { success: success.success, message: "Access Denied" };
		res.status(401).json(result);
	}
}

async function getServerTime(req, res) {
	let success = await users.getServerTime();
	res.json(success);
}

router.use("/", (req, res, next) => {
	logRequest(req, res, next);
});

/* GET home page */
router.get("/", (req, res, next) => {
	res.render("pages/index", {
		title: "Freshness guaranteed!",
	});
});

// Login
router.post("/login", async (req, res, next) => {
	let success;
	res.setHeader("Content-Type", "text/html");
	sess = req.session;
	//success = await users.login(req.body.username, req.body.passwd);
	success = await users.login(req, res);

	let validLogin = success.success;

	if (validLogin) {
		sess.username = req.body.username;
		console.log(success.success);
		//console.log(sess);
		res.redirect("/users");
	} else {
		console.log(success.success);
		// Use redirect
		// Update / path to store correct object
		// containing title and success keys
		res.render("pages/index", {
			title: "Freshness guaranteed!",
			success: success.success,
		});
	}
});

router.get("/logout", async (req, res, next) => {
	//sess = req.session;
	let success = await users.logout(req);
	console.log(success.success);
	//res.send({ success: success });
	res.redirect("/");
});

let m = [logRequest, verifyLogin, getServerTime];
router.get("/getServerTime", m);

// Create New Account (sign up)
router.post("/sign_up", async (req, res, next) => {
	let user;

	user = await users.create(
		null,
		req.body.first_name,
		req.body.last_name,
		req.body.username,
		req.body.passwd
	);
	res.render("pages/index", {
		success: "Account created successfully! You can now login.",
		title: "Freshness guaranteed!",
	});
});

module.exports = router;

//https://cryptic-waters-14698.herokuapp.com/
