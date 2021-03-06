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
		//console.log(res.rows);
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

// Save order
exports.create = async function (order) {
	const order_no = order["order_no"];
	const order_status = order["order_status"];
	const customer_id = order["customer_id"];
	const user_id = order["user_id"];
	const total_amount = order["total_amount"];
	const create_date = order["create_date"];
	const shipping_date = order["shipping_date"];

	console.log(order);

	const insert =
		"INSERT INTO orders \
		(order_number, order_name, order_status, total_amount, create_date, shipping_date, customer_id, user_id) \
		VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING order_id";
	const values = [
		order_no,
		order_no,
		order_status,
		total_amount,
		create_date,
		shipping_date,
		customer_id,
		user_id,
	];
	let result = await pool.query(insert, values);
	order_id = result.rows[0].order_id;

	console.log(order_id);

	const products = order["products"];
	const quantities = order["quantity"];
	const unit_prices = order["unit_price"];

	for (let i = 0; i < products.length; i++) {
		let insert_order_item =
			"INSERT INTO order_item_line (order_id, product_id, unit_price, quantity) \
			 VALUES($1, $2, $3, $4) RETURNING order_item_id";
		let values_order_item = [
			order_id,
			parseInt(products[i]),
			parseFloat(unit_prices[i]),
			parseInt(quantities[i]),
		];
		let result_order_item = await pool.query(
			insert_order_item,
			values_order_item
		);
		order_item_id = result_order_item.rows[0].order_item_id;
		console.log(order_item_id);
	}
	return true;
};
