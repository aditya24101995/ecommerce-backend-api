const { deleteModel } = require("mongoose");
const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate_json) => {
    if (err) {
      return res.status(400).json({
        error: "No such category found",
      });
    }
    console.log(cate_json);
    req.category = cate_json;
    next();
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.createCategory = (req, res) => {
  const cat = new Category(req.body);
  cat.save((err, catjson) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to create/save category in db",
      });
    }
    res.json({ catjson });
  });
};

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "Not categories present",
      });
    }
    res.json({ categories });
  });
};

exports.updateCategory = (req, res) => {
  console.log(req)
  Category.findByIdAndUpdate(
    req.category._id,
    req.body,
    { new: true, useFindAndModify: false },
    (err, catjson) => {
      if (err) {
        return res.status(400).json({
          error: "Category not updated in db",
        });
      }
      return res.json(catjson);
    }
  );
};

exports.deleteCategory = (req, res) => {
  Category.findByIdAndDelete(req.category._id, (err, catjson) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in db",
      });
    }
    return res.json({ message: "Successfully deleted!" });
  });
};


