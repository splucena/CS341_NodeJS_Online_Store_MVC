const User = require("./User");
const Note = require("./User");

let users = [];

exports.update = exports.create = async function (userid, username, password) {
	users[userid] = new User(userid, username, password);
	return users[userid];
};

exports.read = async function (userid) {
	if (users[userid]) return users[userid];
	else throw new Error(`User ${userid} does not exist`);
};

exports.destroy = async function (userid) {
	if (users[userid]) {
		delete users[userid];
	} else {
		throw new Error(`User ${userid} does not exist`);
	}
};

exports.userlist = async function () {
	return Object.keys(users);
};
exports.count = async function () {
	return users.length;
};
exports.close = async function () {};
