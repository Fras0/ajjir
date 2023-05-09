const epxress = require("express");
const User = require("../models/user.model");
const userController = require("../controllers/user.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");
const router = epxress.Router();

router.get("/profile/:id", userController.getProfile);

router.get("/users/edit-profile/:id", userController.getEditProfile);

router.post("/users/edit-profile/:id", userController.editProfile);

module.exports = router;
