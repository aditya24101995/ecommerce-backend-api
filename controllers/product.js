const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, productjson) => {
    if (err) {
      return res.status(400).json({
        error: "No such product found",
      });
    }

    req.product = productjson;
    next();
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image",
      });
    }

    //Add fileds
    let product = new Product(fields);

    //Add file
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "Image size too big. Only file size less than 3MB is accepted",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.contentType;
    }

    //save to db
    product.save((err, productjson) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to create/save product in db",
        });
      }
      res.json({ productjson });
    });
  });
};

exports.getPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", typeof req.product.photo.data);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  Product.findByIdAndDelete(req.product._id, (err, deletejson) => {
    if (err) {
      return res.status(400).json({
        error: "Product not found in db",
      });
    }
    return res.json({ message: "Successfully deleted!" });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image",
      });
    }

    //Add fileds
    let product = req.product;

    product = _.extend(product, fields);

    //Add file
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "Image size too big",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.contentType;
    }

    //save to db
    product.save((err, productjson) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to update product in db",
        });
      }
      res.json({ productjson });
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limitvalue = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? parseInt(req.query.sortBy) : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .limit(limitvalue)
    .sort([[sortBy, "asc"]])
    .exec((err, productsjson) => {
      if (err) {
        return res.status(400).json({
          error: "Not products found in db",
        });
      }
      res.json({ productsjson });
    });
};

exports.uniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, prodCat) => {
    if (err) {
      return res.status(400).json({
        error: "No products of such categories found",
      });
    }
    res.json(prodCat);
  });
};

exports.updateStock = (req, res, next) => {
  let operations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(operations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk update failed",
      });
    }
    next();
  });
};
