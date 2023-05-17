const multer = require("multer");
const uuid = require("uuid").v4;

const uploadProductImg = multer({
  storage: multer.diskStorage({
    destination: "product-data/images",
    filename: function (req, file, cb) {
      cb(null, uuid() + "-" + file.originalname);
    },
  }),
});

const uploadUserImg = multer({
  storage: multer.diskStorage({
    destination: "user-data/profile-images",
    filename: function (req, file, cb) {
      cb(null, uuid() + "-" + file.originalname);
    },
  }),
});

const configuredMulterMiddleware = uploadProductImg.single("image");

const configuredUserMulterMiddleware = uploadUserImg.single("image");

module.exports = {
  configuredMulterMiddleware: configuredMulterMiddleware,
  configuredUserMulterMiddleware: configuredUserMulterMiddleware,
};
