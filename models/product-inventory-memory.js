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
//const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const pool = new pg.Pool(config);

exports.productinventorylist = async function () {
	try {
		const res = await pool.query(
			"SELECT pp.product_name product_name, pi.total_stock quantity, pc.category_name category_name FROM product_inventory pi LEFT JOIN product_product pp ON pp.product_id = pi.product_id LEFT JOIN product_category pc ON pc.category_id = pp.category_id"
		);
		return res.rows;
	} catch (err) {
		console.log(err);
	}
};
