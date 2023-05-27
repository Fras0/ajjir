const stripe = require("stripe")(
  process.env.STRIPE_KEY
);

const db = require("../data/database");
const mongodb = require("mongodb");
const uuid = require("uuid").v4;

let uuidKey;

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
async function showItemRequest(req, res, next) {
  // const ownerData = await User.findByEmail(product.owner);
  // const customerData = await User.findById(req.session.uid);
  const transaction = await Transaction.findById(req.params.id);
  const product = await Product.findById(transaction.itemId);
  const customerData = await User.findByEmail(transaction.customer);
  res.render("transactions/show-item-request", {
    transaction: transaction,
    product: product,
    customerData: customerData,
  });
}

async function acceptItemRequest(req, res, next) {
  const transaction = await Transaction.findById(req.params.transId);
  const product = await Product.findById(transaction.itemId);
  const ownerData = await User.findByEmail(product.owner);
  const customerData = await User.findByEmail(transaction.customer);
  const notificationData = {
    title: "Item Request Accepted",
    content: `${ownerData.name} has accepted your request for ${product.name}`,
    history: new Date(),
    user: customerData._id,
    status: "unread",
    transactionId: new mongodb.ObjectId(transaction.id),
  };

  const notification = new Notification(notificationData);

  try {
    await notification.save();
  } catch (error) {
    next(error);
    return;
  }

  transaction.status = "accepted";
  try {
    await transaction.save();
  } catch (error) {
    next(error);
    return;
  }

  customerData.balance -= transaction.price;
  const newCustomer = new User(customerData);
  try {
    await newCustomer.save();
  } catch (error) {
    next(error);
    return;
  }
  
  ownerData.balance += transaction.price - 10;
  const newOwner = new User(ownerData);
  try {
    await newOwner.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/products");
}

async function rejectItemRequest(req, res, next) {
  const transaction = await Transaction.findById(req.params.transId);
  const product = await Product.findById(transaction.itemId);
  const ownerData = await User.findByEmail(product.owner);
  const customerData = await User.findByEmail(transaction.customer);
  const notificationData = {
    title: "Item Request Rejected",
    content: `${ownerData.name} has rejected your request for ${product.name}`,
    history: new Date(),
    user: customerData._id,
    status: "unread",
    transactionId: new mongodb.ObjectId(transaction.id),
  };

  const notification = new Notification(notificationData);

  try {
    await notification.save();
  } catch (error) {
    next(error);
    return;
  }

  transaction.status = "rejected";
  try {
    await transaction.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/products");
}

async function addTransaction(req, res, next) {
  const product = await Product.findById(req.params.id);
  const ownerData = await User.findByEmail(product.owner);
  const customerData = await User.findById(req.session.uid);
  // if (customerData.balance < req.body.price) {
  //   //overlay
  //   console.log(customerData.balance);
  //   console.log(product.price * 1.1);
  //   console.log("u are broke lol");
  // }
  const transactionData = {
    itemId: product.id,
    owner: ownerData.email,
    customer: customerData.email,
    originLng: product.longitude,
    originLat: product.latitude,
    destLng: req.body.longitude,
    destLat: req.body.latitude,
    price: req.body.price,
    delivered: false,
    back: false,
    status: "request",
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    maxDuration: req.body.maxDuration,
  };
  transaction = new Transaction(transactionData);

  let trans;
  try {
    trans = await transaction.save();
  } catch (error) {
    next(error);
    return;
  }

  notificationData = {
    title: "Item Request",
    content: `${customerData.name} has requested your item: ${product.name}`,
    history: new Date(),
    user: ownerData._id,
    status: "unread",
    transactionId: trans.insertedId,
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

function getBuyJJ(req, res) {
  res.render("transactions/buy-jpoints", { id: res.locals.uid });
}

async function buyJJ(req, res, next) {
  const amount = +req.params.id;
  const user = await User.findById(req.session.uid);

  uuidKey = uuid();

  let price;
  if (amount === 500) {
    price = 750;
  } else if (amount === 100) {
    price = 180;
  } else {
    price = 100;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price_data: {
            currency: "egp",
            product_data: {
              name: `${amount}JJ`,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/success/${user._id}/${amount}/${uuidKey}`,
      cancel_url: `http://localhost:3000/${user._id}`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    return next(error);
  }
}

async function getJJSuccess(req, res) {
  const user = await User.findById(req.params.id);
  const amount = +req.params.amount;
  const key = req.params.uuidkey;

  if (key === uuidKey) {
    const myUser = new User(user);
    myUser.points += amount;
    try {
      await myUser.save();
    } catch (error) {
      return next(error);
    }
    res.redirect("/");
  } else {
    res.redirect("/");
  }
}

async function addMoney(req, res, next) {
  const amount = +req.params.amount;
  const user = await User.findById(req.session.uid);

  uuidKey = uuid();

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price_data: {
            currency: "egp",
            product_data: {
              name: `${amount} EGP`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/money-success/${user._id}/${amount}/${uuidKey}`,
      cancel_url: `http://localhost:3000/${user._id}`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    return next(error);
  }
}

async function getMoneySuccess(req, res) {
  const user = await User.findById(req.params.id);
  const amount = +req.params.amount;
  const key = req.params.uuidkey;

  if (key === uuidKey) {
    const myUser = new User(user);
    myUser.balance += amount;
    try {
      await myUser.save();
    } catch (error) {
      return next(error);
    }
    res.redirect("/");
  } else {
    res.redirect("/");
  }
}

// async function retireveCard(req, res) {
//   const card = await stripe.customers.retrieveSource("cus_NwAZFjq6ZjpkHp");
//   console.log(card);
// }

module.exports = {
  getRentalTerms: getRentalTerms,
  addTransaction: addTransaction,
  showItemRequest: showItemRequest,
  getBuyJJ: getBuyJJ,
  buyJJ: buyJJ,
  getJJSuccess: getJJSuccess,
  addMoney: addMoney,
  getMoneySuccess: getMoneySuccess,
  acceptItemRequest: acceptItemRequest,
  rejectItemRequest: rejectItemRequest,
  // retireveCard: retireveCard,
};
