const epxress = require("express");
const transactionController = require("../controllers/transaction.controller");

const router = epxress.Router();

router.get("/rental-terms/:id", transactionController.getRentalTerms);

router.get("/show-item-request/:id", transactionController.showItemRequest);

router.post(
  "/show-item-request/:transId/accept",
  transactionController.acceptItemRequest
);

router.post(
  "/show-item-request/:transId/reject",
  transactionController.rejectItemRequest
);

router.post("/rental-terms/:id", transactionController.addTransaction);

router.get("/buy-jj/:id", transactionController.getBuyJJ);

router.post("/buy-jj/:id", transactionController.buyJJ);

router.get("/success/:id/:amount/:uuidkey", transactionController.getJJSuccess);

router.post("/add-money/:amount", transactionController.addMoney);

router.get(
  "/money-success/:id/:amount/:uuidkey",
  transactionController.getMoneySuccess
);

module.exports = router;
