var express = require("express");
var router = express.Router();
const users = require("../models/users-memory");

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

/* GET home page */
router.get("/", (req, res, next) => {
	res.render("pages/index", {
		title: "SRP Online Store",
	});
});

module.exports = router;
