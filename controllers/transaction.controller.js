const stripe = require("stripe")(
  "sk_test_51N8NXiC5tPhldoVqD7SSLeWDizu93PaCOiZa8HPEIVzPwdhd96cEhHAsX86hiDhqRyb9UJtgqWKEfEVXqKDX2jvW00jaCtnMM5"
);

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

  // const customer = await stripe.customers.retrieve(
  //   'cus_NwAZFjq6ZjpkHp'
  // );

  // const card = await stripe.customers.createSource(
  //   'cus_NwAZFjq6ZjpkHp',
  //   {source: 'tok_amex'}
  // );

  // const paymentMethod = await stripe.paymentMethods.create({
  //   type: 'card',
  //   card: {
  //     number: '4242424242424242',
  //     exp_month: 8,
  //     exp_year: 2024,
  //     cvc: '314',
  //   },
  // });


  // console.log(paymentMethod);
  // const paymentMethodId = paymentMethod.id; 

  // const attatchedPaymentMethod = await stripe.paymentMethods.attach(
  //   `${paymentMethodId}`,
  //   {customer: 'cus_NwAZFjq6ZjpkHp'}
  // );


  // const payout = await stripe.payouts.create({
  //   amount: 2500,
  //   currency: "egp",
  //   destination: `${paymentMethodId}`,
  // });
  // console.log(payout);

  res.render("transactions/edit-rental-terms", {
    product: product,
    ownerData: ownerData,
    customerData: customerData,
  });
}
async function showItemRequest(req, res, next) {
  // const product = await Product.findById(req.params.id);
  // const ownerData = await User.findByEmail(product.owner);
  // const customerData = await User.findById(req.session.uid);
  const transaction = await Transaction.findById(req.params.id);
  res.render("transactions/show-item-request", { transaction: transaction });
}

async function addTransaction(req, res, next) {
  const product = await Product.findById(req.params.id);
  const ownerData = await User.findByEmail(product.owner);
  const customerData = await User.findById(req.session.uid);
  if (customerData.balance < product.price * 1.1) {
    //overlay
    console.log(customerData.balance);
    console.log(product.price * 1.1);
    console.log("u are broke lol");
  }
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

async function buyJJ(req, res, next) {
  const amount = +req.params.id;
  const user = await User.findById(req.session.uid);
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
            unit_amount: amount * 10 * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/`,
      cancel_url: `http://localhost:3000/${user._id}`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    return next(error);
  }

  const myUser = new User(user);
  myUser.points += amount;
  try {
    await myUser.save();
  } catch (error) {
    return next(error);
  }
}
async function addMoney(req, res, next) {
  const amount = +req.params.amount;
  const user = await User.findById(req.session.uid);
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
            unit_amount: amount * 10 * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/`,
      cancel_url: `http://localhost:3000/${user._id}`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    return next(error);
  }

  const myUser = new User(user);
  myUser.balance += amount;
  try {
    await myUser.save();
  } catch (error) {
    return next(error);
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
  buyJJ: buyJJ,
  addMoney: addMoney,
  // retireveCard: retireveCard,
};
