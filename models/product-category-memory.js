const pg = require("pg");

const config = {
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: process.env.DB_PORT,
};

// connectionString: process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
//const pool = new pg.Pool(config);

exports.productcategorylist = async function () {
	try {
		const res = await pool.query("SELECT * FROM product_category");
		return res.rows;
	} catch (err) {
		console.log(err);
	}
};
