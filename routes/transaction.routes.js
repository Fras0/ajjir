
const epxress = require("express");
const transactionController = require("../controllers/transaction.controller");

const router = epxress.Router();

router.get("/rental-terms/:id", transactionController.getRentalTerms);

router.get("/show-item-request/:id",transactionController.showItemRequest)

router.post("/rental-terms/:id", transactionController.addTransaction);

router.post("/buy-jj/:id", transactionController.buyJJ);

router.post("/add-money/:amount", transactionController.addMoney);



module.exports = router;
