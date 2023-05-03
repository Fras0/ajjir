const mongodb = require("mongodb");

const db = require("../data/database");

class Product {
  constructor(productData) {
    this.name = productData.name;
    this.price = +productData.price;
    this.description = productData.description;
    this.longitude = productData.longitude;
    this.latitude = productData.latitude;
    this.maxDuration = +productData.maxDuration;
    this.category = productData.category;
    this.owner = productData.owner;
    this.image = productData.image; // the name of the image file
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error("Could not find product with provided id.");
      error.code = 404;
      throw error;
    }

    return new Product(product);
  }

  static async findAll(category) {
    if (!category) {
      const products = await db.getDb().collection("products").find().toArray();

      return products.map(function (productDocument) {
        return new Product(productDocument);
      });
    } else {
      const products = await db
        .getDb()
        .collection("products")
        .find({ category: category })
        .toArray();

      return products.map(function (productDocument) {
        return new Product(productDocument);
      });
    }
  }

  static async findMultiple(ids) {
    const productIds = ids.map(function (id) {
      return new mongodb.ObjectId(id);
    });

    const products = await db
      .getDb()
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      name: this.name,
      description: this.description,
      price: this.price,
      image: this.image,
      longitude: this.longitude,
      latitude: this.latitude,
      category: this.category,
      maxDuration: this.maxDuration,
      owner: this.owner,
    };

    if (this.id) {
      const productId = new mongodb.ObjectId(this.id);

      if (!this.image) {
        delete productData.image;
      }

      await db.getDb().collection("products").updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      );
    } else {
      await db.getDb().collection("products").insertOne(productData);
    }
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("products").deleteOne({ _id: productId });
  }
}

module.exports = Product;
