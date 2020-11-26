var express = require("express");
var router = express.Router();
const users = require("../models/users-memory");

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

/* GET home page */
router.get("/", async (req, res, next) => {
	let userlist = await users.userlist();
	let userIdPromises = userlist.map((userid) => {
		return users.read(userid);
	});

	let userslist = await Promise.all(userIdPromises);
	res.render("pages/users", { title: "Users", userslist: userslist });
});

module.exports = router;
