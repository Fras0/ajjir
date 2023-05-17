const epxress = require("express");
const User = require("../models/user.model");
const userController = require("../controllers/user.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");
const uploadVerificationImages = require("../middlewares/upload-verification-images");
const router = epxress.Router();

router.get("/profile/:id", userController.getProfile);

router.get("/users/edit-profile/:id", userController.getEditProfile);

router.get("/users/verification/:id", userController.getVerification);

router.post(
  "/users/verification/:id",
  uploadVerificationImages,
  userController.verification
);

router.post("/users/edit-profile/:id", userController.editProfile);

module.exports = router;
