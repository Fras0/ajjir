const mongodb = require("mongodb");

const db = require("../data/database");

class Notification {
  constructor(notificationData) {
    this.title = notificationData.title;
    this.content = notificationData.content;
    this.history = notificationData.history;
    this.user = notificationData.user;
    this.status = notificationData.status;

    if (notificationData._id) {
      this.id = notificationData._id.toString();
    }
  }

  static async findById(notificationId) {
    let notifId;
    try {
      notifId = new mongodb.ObjectId(notificationId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const notification = await db
      .getDb()
      .collection("notifications")
      .findOne({ _id: notifId });

    if (!notification) {
      const error = new Error("Could not find notification with provided id.");
      error.code = 404;
      throw error;
    }

    return new Notification(notification);
  }

  static async findByUserId(userId) {
    let uid;
    try {
      uid = new mongodb.ObjectId(userId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const notifications = await db
      .getDb()
      .collection("notifications")
      .find({ user: uid })
      .toArray();

    if (!notifications) {
      const error = new Error("Could not find notification with provided id.");
      error.code = 404;
      throw error;
    }

    return notifications.map(function (notificationDocument) {
      return new Notification(notificationDocument);
    });
  }

  async save() {
    const notificationData = {
      title: this.title,
      content: this.content,
      history: this.history,
      user: this.user,
      status: this.status,
    };

    if (this.id) {
      const notificationId = new mongodb.ObjectId(this.id);

      await db.getDb().collection("notifications").updateOne(
        { _id: notificationId },
        {
          $set: notificationData,
        }
      );
    } else {
      await db.getDb().collection("notifications").insertOne(notificationData);
    }
  }

  remove() {
    const notificationId = new mongodb.ObjectId(this.id);
    return db
      .getDb()
      .collection("notifications")
      .deleteOne({ _id: notificationId });
  }
}

module.exports = Notification;
