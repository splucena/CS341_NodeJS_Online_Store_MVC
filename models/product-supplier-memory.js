//const User = require("./User");
const pg = require("pg");
//const bcrypt = require("bcrypt");

const config = {
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: process.env.DB_PORT,
};

// connectionString: process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
//const pool = new pg.Pool(config);

exports.productsupplierlist = async function () {
	try {
		const res = await pool.query("SELECT * FROM product_supplier");
		return res.rows;
	} catch (err) {
		console.log(err);
	}
};
