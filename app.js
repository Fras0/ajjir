require("dotenv").config();
const passport = require("passport");
require("./config/passport-setup");



const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const transactionRoutes = require("./routes/transaction.routes");
const baseRoutes = require("./routes/base.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// app.use(csrf());

// app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(productRoutes);
app.use(transactionRoutes);
app.use(authRoutes);
app.use(userRoutes)

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
