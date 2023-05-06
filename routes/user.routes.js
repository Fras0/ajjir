const epxress = require("express");
const User = require("../models/user.model");
const userContrroller = require("../controllers/user.controller");
const router = epxress.Router();

router.get("/profile", userContrroller.getProfile);

module.exports = router;
