const User = require("./User");
const pg = require("pg");
const bcrypt = require("bcrypt");

const config = {
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: process.env.DB_PORT,
};

// connectionString: process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
//const pool = new pg.Pool(config);

let users = [];
let user = undefined;

async function hashPassword(passwd) {
	// hash password
	const saltRounds = 10;

	// bcrypt doesn't return a promise
	// instatiate a new promise to make bcrypt async
	let hashedPassword = await new Promise((resolve, reject) => {
		bcrypt.hash(passwd, saltRounds, (err, hash) => {
			if (err) {
				console.log(err);
				reject(err);
			}
			resolve(hash);
		});
	});

	return hashedPassword;
}

async function unhashPassword(passwd, hash) {
	let unhashedPassword = await new Promise((resolve, reject) => {
		bcrypt.compare(passwd, hash, (err, result) => {
			if (err) {
				console.log(err);
				reject(err);
			}
			resolve(result);
		});
	});
	return unhashedPassword;
}

exports.create = async function (
	userid,
	first_name,
	last_name,
	username,
	passwd
) {
	try {
		let hashedPassword = await hashPassword(passwd);

		const text =
			"INSERT INTO users (first_name, last_name, username, passwd) VALUES($1, $2, $3, $4) RETURNING user_id";
		const values = [first_name, last_name, username, hashedPassword];

		let res = await pool.query(text, values);

		userid = res.rows[0].user_id;
		let user = new User(
			userid,
			first_name,
			last_name,
			username,
			hashedPassword
		);

		// create client copy of user
		users[userid] = user;
		return user;
	} catch (err) {
		console.log("Database " + err);
	}
};

// Team activity
exports.login = async function (req, res) {
	/*if (req.body.username === "admin" && req.body.passwd === "password") {
		success = true;
	} else {
		success = false;
	}

	return { success: success };*/
	try {
		let success;
		let username = req.body.username;
		let passwd = req.body.passwd;

		const text = "SELECT user_id, passwd FROM users WHERE username = $1";
		const values = [username];
		const res = await pool.query(text, values);

		if (res.rowCount > 0) {
			let dbHashedPassword = res.rows[0].passwd;
			let unhashedPassword = await unhashPassword(
				passwd,
				dbHashedPassword
			);

			if (unhashedPassword) {
				success = true;
			} else {
				success = false;
			}
		} else {
			success = false;
		}
		return { success: success };
	} catch (err) {
		console.log("Database " + err);
	}
};

exports.logout = async function (req, res) {
	let success, sess;
	sess = req.session;
	if (sess && sess.username) {
		sess.destroy();
		success = true;
	} else {
		success = false;
	}
	//res.json({ success: success });
	return { success: success };
};

exports.getServerTime = async function () {
	let requestTime = new Date();
	return { success: true, requestTime: requestTime };
};

exports.update = async function (
	userid,
	first_name,
	last_name,
	username,
	passwd
) {
	try {
		// Get user current detail
		// compare changes
		// only update changes
		let currentUserDetailText =
			"SELECT first_name, last_name, username, passwd FROM users WHERE user_id = $1";
		let currentUserDetailValue = [userid];
		let currentUserDetail = await pool.query(
			currentUserDetailText,
			currentUserDetailValue
		);

		let currentUserDetailResult = currentUserDetail.rows[0];
		let currentUserDetailFirstName = currentUserDetailResult.first_name;
		let currentUserDetailLastName = currentUserDetailResult.last_name;
		let currentUserDetailUsername = currentUserDetailResult.username;
		let currentUserDetailPassword = currentUserDetailResult.passwd;

		let values = [];
		values.push(
			first_name !== currentUserDetailFirstName
				? first_name
				: currentUserDetailFirstName
		);
		values.push(
			last_name !== currentUserDetailLastName
				? last_name
				: currentUserDetailLastName
		);
		values.push(
			username !== currentUserDetailUsername
				? username
				: currentUserDetailUsername
		);
		values.push(
			passwd !== currentUserDetailPassword
				? await hashPassword(passwd)
				: currentUserDetailPassword
		);
		values.push(userid);

		const text =
			"UPDATE users SET first_name = $1, last_name = $2, username = $3, passwd = $4 WHERE user_id = $5";

		await pool.query(text, values);
		let user = new User(userid, first_name, last_name, username, passwd);
		if (users[userid]) {
			delete users[userid];
		}

		users[userid] = user;

		return user;
	} catch (err) {
		console.log("Database" + err);
	}
};

exports.read = async function (userid) {
	try {
		const text =
			"SELECT user_id as userid, first_name, last_name, username, passwd FROM users";
		const res = await pool.query(text);

		res.rows.forEach((val) => {
			users[val.userid] = val;
		});

		if (users[userid]) {
			return users[userid];
		} else {
			throw new Error(`User ${userid} does not exist`);
		}
	} catch (err) {
		console.log(err);
	}
};

exports.getUserDetail = async function (userid) {
	try {
		const text =
			"SELECT user_id as userid, first_name, last_name, username, passwd FROM users WHERE user_id = $1";
		const value = [userid];

		const res = await pool.query(text, value);
		// I could have taken the value from users
		// but to illustrate ajax call
		// Im going to get fetch value directly
		// from the database
		//let user = users[userid];W
		return res.rows;
	} catch (err) {
		console.log("Database " + err);
	}
};

exports.destroy = async function (userid) {
	try {
		const text = "DELETE FROM users WHERE user_id = $1";
		const value = [userid];

		await pool.query(text, value);

		if (users[userid]) {
			delete users[userid];
		} else {
			throw new Error(`User ${userid} does not exist`);
		}
	} catch (err) {
		console.log(err);
	}
};

exports.userlist = async function () {
	try {
		const res = await pool.query("SELECT * FROM users");
		return res.rows;
	} catch (err) {
		console.log(err);
	}
};

exports.count = async function () {
	return users.length;
};
exports.close = async function () {};
