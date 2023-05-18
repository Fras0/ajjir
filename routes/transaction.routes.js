const epxress = require("express");
const transactionController = require("../controllers/transaction.controller");

const router = epxress.Router();

router.get("/rental-terms/:id", transactionController.getRentalTerms);

router.post("/rental-terms/:id", transactionController.addTransaction);


module.exports = router;
