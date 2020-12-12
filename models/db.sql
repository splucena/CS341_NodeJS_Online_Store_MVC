/* DATABASE: d37erhhggeh672 */

/*
TABLE: product_category
*/

CREATE TABLE product_category(
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    category_desc TEXT,
    active BOOLEAN DEFAULT TRUE
);

/*
TABLE: product_supplier
*/

CREATE TABLE product_supplier(
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255),
    supplier_addr VARCHAR(255),
    country VARCHAR(255),
    phone VARCHAR(12),
    active BOOLEAN DEFAULT TRUE
);

/*
TABLE: product_product
*/

CREATE TABLE product_product(
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255),
    unit_price FLOAT,
    category_id INT REFERENCES product_category(category_id),
    supplier_id INT REFERENCES product_supplier(supplier_id),
    active BOOLEAN DEFAULT TRUE
);

/*
TABLE: product_inventory
*/

CREATE TABLE product_inventory(
    inventory_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES product_product(product_id),
    total_stock INT DEFAULT 0,
    write_date TIMESTAMP DEFAULT NOW()
);


/*
TABLE: users
*/

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    username VARCHAR(20),
    passwd VARCHAR(255),
    position VARCHAR(25),
    phone VARCHAR(12),
    active BOOLEAN DEFAULT TRUE
);

/*
TABLE: customer
*/

CREATE TABLE customer(
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    billing_addr VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    customer_desc TEXT,
    phone VARCHAR(12),
    shipping_addr VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE
);


/*
TABLE: orders
*/

CREATE TYPE order_status AS ENUM('draft', 'processing', 'in_transit', 'delivered');
CREATE TABLE orders(
    order_id SERIAL PRIMARY KEY,
    order_name VARCHAR(255) NOT NULL,
    order_number VARCHAR(10) NOT NULL,
    order_desc TEXT,
    order_status order_status,
    total_amount FLOAT,
    create_date TIMESTAMP DEFAULT NOW(),
    shipping_date TIMESTAMP,
    customer_id INT REFERENCES customer(customer_id),
    user_id INT REFERENCES users(user_id)
);

/*
TABLE: order_line_item
*/

CREATE TABLE order_item_line(
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    product_id INT REFERENCES product_product(product_id),
    unit_price FLOAT,
    quantity INT,
    discount INT
);

/*
TABLE: invoice
*/

CREATE TABLE invoice(
    invoice_id SERIAL PRIMARY KEY,
    order_number VARCHAR(10) NOT NULL,
    invoice_date TIMESTAMP DEFAULT NOW(),
    invoice_total FLOAT
);