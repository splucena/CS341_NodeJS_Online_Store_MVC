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

exports.orderlist = async function () {
	try {
		const query =
			"SELECT o.order_id order_id, \
			o.order_number order_no, \
			CONCAT(c.first_name, ' ', c.last_name) customer_name, \
			o.order_status status, o.create_date::date date_created, \
			o.shipping_date::date shipping_date, o.total_amount total_amount, \
			CONCAT(u.first_name, ' ', u.last_name) processor \
			FROM orders o \
			LEFT JOIN customer c ON c.customer_id=o.customer_id \
			LEFT JOIN users u ON u.user_id=o.user_id";
		const res = await pool.query(query);
		console.log(res.rows);
		return res.rows;
	} catch (err) {
		console.log(err);
	}
};

exports.getOrderDetail = async function (orderid) {
	try {
		const text =
			"SELECT o.order_id order_id, \
		o.order_number order_no, \
		CONCAT(c.first_name, ' ', c.last_name) customer_name, \
		o.order_status status, o.create_date::date date_created, \
		o.shipping_date::date shipping_date, o.total_amount total_amount, \
		o.create_date::date date_created, \
		CONCAT(u.first_name, ' ', u.last_name) processor, \
		oil.unit_price unit_price, \
		oil.quantity quantity, \
		pp.product_name product_name \
		FROM order_item_line oil \
		LEFT JOIN orders o ON o.order_id=oil.order_id \
		LEFT JOIN customer c ON c.customer_id=o.customer_id \
		LEFT JOIN users u ON u.user_id=o.user_id \
		LEFT JOIN product_product pp ON pp.product_id=oil.product_id \
		WHERE oil.order_id = $1";
		const value = [orderid];
		const res = await pool.query(text, value);
		return res.rows;
	} catch (err) {
		console.log("Database " + err);
	}
};
