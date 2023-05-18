const db = require("../data/database");
const mongodb = require("mongodb");

const Product = require("../models/product.model");
const Transaction = require("../models/transaction.model");
const Notification = require("../models/notifications.model");

const User = require("../models/user.model");

async function getRentalTerms(req, res, next) {
  const product = await Product.findById(req.params.id);
  const ownerData = await User.findByEmail(product.owner);
  const customerData = await User.findById(req.session.uid);
  res.render("transactions/edit-rental-terms", {
    product: product,
    ownerData: ownerData,
    customerData: customerData,
  });
}
async function addTransaction(req, res, next) {
  const product = await Product.findById(req.params.id);
  const ownerData = await User.findByEmail(product.owner);
  const customerData = await User.findById(req.session.uid);

  const transactionData = {
    itemId: product.id,
    owner: ownerData.email,
    customer: customerData.email,
    originLng: product.longitude,
    originLat: product.latitude,
    destLng: req.body.longitude,
    destLat: req.body.latitude,
    price: product.price,
    delivered: false,
    back: false,
    status: "request",
    maxDuration: product.maxDuration,
  };
  transaction = new Transaction(transactionData);

  try {
    await transaction.save();
  } catch (error) {
    next(error);
    return;
  }

  notificationData = {
    title: "Item request",
    content: `${customerData.name} has requested your item: ${product.name}`,
    history: new Date(),
    user: ownerData.email,
    status: "unread",
  };

  notification = new Notification(notificationData);

  try {
    await notification.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/products");
}

module.exports = {
  getRentalTerms: getRentalTerms,
  addTransaction: addTransaction,
};
