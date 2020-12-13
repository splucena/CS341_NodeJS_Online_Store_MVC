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

exports.productproductlist = async function () {
	try {
		const res = await pool.query(
			"SELECT pp.product_id product_id, pp.product_name product_name, " +
				"pc.category_name category_name, " +
				"ps.supplier_name supplier_name, " +
				"pp.unit_price unit_price " +
				"FROM product_product pp " +
				"LEFT JOIN product_category pc ON pc.category_id=pp.category_id " +
				"LEFT JOIN product_supplier ps ON ps.supplier_id=pp.supplier_id"
		);
		return res.rows;
	} catch (err) {
		console.log(err);
	}
};

exports.getProductDetail = async function (product_id) {
	try {
		const text =
			"SELECT unit_price FROM product_product WHERE product_id = $1";
		const value = [product_id];
		const result = await pool.query(text, value);
		return result.rows;
	} catch (err) {
		console.log("Database " + err);
	}
};
