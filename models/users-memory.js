const User = require("./User");
const pg = require("pg");

const config = {
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: process.env.DB_PORT,
};

// connectionString: process.env.DATABASE_URL
//const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const pool = new pg.Pool(config);

async function query(q) {
	const client = await pool.connect();
	let res;
	try {
		await client.query("BEGIN");
		try {
			res = await client.query(q);
			await client.query("COMMIT");
		} catch (err) {
			await client.query("ROLLBACK");
			throw err;
		}
	} finally {
		client.release();
	}
	return res;
}

let users = [];
let user = undefined;

/*exports.update = exports.create = async function (userid, username, password) {
	users[userid] = new User(userid, username, password);
	return users[userid];
};*/

exports.create = async function (
	userid,
	first_name,
	last_name,
	username,
	passwd
) {
	try {
		const text =
			"INSERT INTO users (first_name, last_name, username, passwd) VALUES($1, $2, $3, $4) RETURNING user_id";
		const values = [first_name, last_name, username, passwd];

		let res = await pool.query(text, values);

		userid = res.rows[0].user_id;
		let user = new User(userid, first_name, last_name, username, passwd);

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
		const text =
			"SELECT user_id FROM users WHERE username = $1 AND passwd= $2";
		const values = [username, passwd];
		const res = await pool.query(text, values);
		console.log(res);
		if (res.rowCount > 0) {
			success = true;
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
	const text =
		"UPDATE users SET first_name = $1, last_name = $2, username = $3, passwd = $4 WHERE user_id = $5";
	const values = [first_name, last_name, username, passwd, userid];

	try {
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
		//let user = users[userid];
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
