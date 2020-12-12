var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var logger = require("morgan");

// db environment
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var customersRouter = require("./routes/customers");
var productCategoryRouter = require("./routes/product-category");
var productSupplierRouter = require("./routes/product-supplier");
var productInventoryRouter = require("./routes/product-inventory");
var productProductRouter = require("./routes/product-product");

var app = express();

// Configure session
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
	})
);

// libraries
app.use(
	"/css",
	express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
	"/js",
	express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
	"/js",
	express.static(path.join(__dirname, "node_modules/jquery/dist"))
);
app.use(
	"/js",
	express.static(path.join(__dirname, "node_modules/popper.js/dist/umd"))
);
app.use(
	"/css",
	express.static(
		path.join(__dirname, "node_modules/@fortawesome/fontawesome-free/css")
	)
);
app.use(
	"/webfonts",
	express.static(
		path.join(
			__dirname,
			"node_modules/@fortawesome/fontawesome-free/webfonts"
		)
	)
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/customers", customersRouter);
app.use("/product-category", productCategoryRouter);
app.use("/product-supplier", productSupplierRouter);
app.use("/product-inventory", productInventoryRouter);
app.use("/product-product", productProductRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
