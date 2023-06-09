const mongodb = require("mongodb");

const db = require("../data/database");

class Transaction {
  constructor(transactionData) {
    this.itemId = transactionData.itemId;
    this.owner = transactionData.owner;
    this.customer = transactionData.customer;
    this.originLng = transactionData.originLng;
    this.originLat = transactionData.originLat;
    this.destLng = transactionData.destLng;
    this.destLat = transactionData.destLat;
    this.price = +transactionData.price;
    this.delivered = transactionData.delivered;
    this.back = transactionData.back;
    this.status = transactionData.status;
    this.startDate = transactionData.startDate;
    this.endDate = transactionData.endDate;
    this.maxDuration = transactionData.maxDuration;

    if (transactionData._id) {
      this.id = transactionData._id.toString();
    }
  }

  static async findById(transactionId) {
    let transId;
    try {
      transId = new mongodb.ObjectId(transactionId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const transaction = await db
      .getDb()
      .collection("transactions")
      .findOne({ _id: transId });

    if (!transaction) {
      const error = new Error("Could not find transaction with provided id.");
      error.code = 404;
      throw error;
    }

    return new Transaction(transaction);
  }

  async save() {
    const transactionData = {
      itemId: this.itemId,
      owner: this.owner,
      customer: this.customer,
      originLng: this.originLng,
      originLat: this.originLat,
      destLng: this.destLng,
      destLat: this.destLat,
      price: this.price,
      delivered: this.delivered,
      back: this.back,
      status: this.status,
      maxDuration: this.maxDuration,
      startDate: this.startDate,
      endDate: this.endDate,
    };

    if (this.id) {
      const transactionId = new mongodb.ObjectId(this.id);

      return await db.getDb().collection("transactions").updateOne(
        { _id: transactionId },
        {
          $set: transactionData,
        }
      );
    } else {
      return await db
        .getDb()
        .collection("transactions")
        .insertOne(transactionData);
    }
  }

  remove() {
    const transactionId = new mongodb.ObjectId(this.id);
    return db
      .getDb()
      .collection("transactoins")
      .deleteOne({ _id: transactionId });
  }
}

module.exports = Transaction;
