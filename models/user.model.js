const bcrypt = require("bcryptjs");
const db = require("../data/database");
const mongodb = require("mongodb");

class User {
  constructor(userData) {
    this.email = userData.email;
    this.password = userData.password;
    this.phone = userData.phone;
    this.name = userData.name;
    this.address = {
      street: userData.street,
      city: userData.city,
      country: userData.country,
    };
    if (userData._id) {
      this.id = userData._id.toString();
    }
    if (userData.isVerified) {
      this.isVerified = userData.isVerified;
    }
  }

  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);

    return db
      .getDb()
      .collection("users")
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async existsAllready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      phone: this.phone,
      address: this.address,
    });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  async save() {
    const userData = {
      email: this.email,
      name: this.name,
      phone: this.phone,
      address: this.address,
    };

    if (this.id) {
      const userId = new mongodb.ObjectId(this.id);

      await db.getDb().collection("users").updateOne(
        { _id: userId },
        {
          $set: userData,
        }
      );
    } else {
      await db.getDb().collection("users").insertOne(userData);
    }
  }

  async verify() {
    if (this.id) {
      const userId = new mongodb.ObjectId(this.id);

      await db
        .getDb()
        .collection("users")
        .updateOne(
          { _id: userId },
          {
            $set: { isVerified: true },
          }
        );
    }
  }
}

module.exports = User;
