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

  static async findAll(req) {
    try {
      const page = parseInt(req.query.page) - 1 || 0;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || "";
      let sort = req.query.sort || "rating";
      let categories = req.query.categories || "All";

      // let maxDuration = req.query.maxDuration || "6";
      let minPrice = parseInt(req.query.minPrice) || 0;
      let maxPrice = parseInt(req.query.maxPrice) || 10000000;

      if (req.query.price) {
        if (req.query.price === "Under 100") {
          minPrice = 0;
          maxPrice = 100;
        } else if (req.query.price === "100 - 500") {
          minPrice = 100;
          maxPrice = 500;
        } else if (req.query.price === "500 - 1000") {
          minPrice = 500;
          maxPrice = 1000;
        } else if (req.query.price === "Over 1000") {
          minPrice = 1000;
        }
      }

      const allCategories = ["tools", "cars", "houses", "electronics", "books"];

      categories === "All"
        ? (categories = [...allCategories])
        : (categories = req.query.categories.split(","));
      // req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

      // let sortBy = {};
      // if (sort[1]) {
      //   sortBy[sort[0]] = sort[1];
      // } else {
      //   sortBy[sort[0]] = "asc";
      // }

      const products = await db
        .getDb()
        .collection("products")
        .find({
          $and: [
            { name: { $regex: search, $options: "i" } },
            //   { maxDuration: maxDuration },
            { price: { $gte: minPrice } },
            { price: { $lte: maxPrice } },
            { category: { $in: [...categories] } },
          ],
        })
        .toArray();
      // movies = db.products.find({$and: [ {name: {$regex:"ca",$options:"i"}}, {maxDuration:"6"}, {price:{$gte:1000} }  ] })

      // const movies = await Movie.find({ name: { $regex: search, $options: "i" } })
      // 	.where("genre")
      // 	.in([...genre])
      // 	.sort(sortBy)
      // 	.skip(page * limit)
      // 	.limit(limit);

      // const total = await Movie.countDocuments({
      // 	genre: { $in: [...genre] },
      // 	name: { $regex: search, $options: "i" },
      // });

      // const response = {
      //   error: false,
      //   //   total,
      //   //   page: page + 1,
      //   //   limit,
      //   categories: allCategories,
      //   products,
      // };

      return products.map(function (productDocument) {
        return new Product(productDocument);
      });
      // res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  }

  // static async findAll(category) {
  //   if (!category) {
  //     const products = await db.getDb().collection("products").find().toArray();

  //     return products.map(function (productDocument) {
  //       return new Product(productDocument);
  //     });
  //   } else {
  //     const products = await db
  //       .getDb()
  //       .collection("products")
  //       .find({ category: category })
  //       .toArray();

  //     return products.map(function (productDocument) {
  //       return new Product(productDocument);
  //     });
  //   }
  // }

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
