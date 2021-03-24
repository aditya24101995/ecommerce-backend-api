const express = require("express");
const router = express.Router();
const {
  getProduct,
  getProductById,
  createProduct,
  getPhoto,
  deleteProduct,
  updateProduct,
  getAllProducts,
  uniqueCategories,
} = require("../controllers/product");
const { isSignedIn, authenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { check, validationResult } = require("express-validator");

router.param("userId", getUserById);
//get product by id
router.param("productId", getProductById);
router.get("/product/:productId", getProduct);

//Middleware to get photo using produt id
router.get("/product/photo/:productId", getPhoto);

//create a product
router.post(
  "/product/create/:userId",
  [
    check("name", "Name is required, maxlength upto 32 characters").isLength({
      max: 32,
    }),
    check(
      "description",
      "Description is required, maxlength upto 2000 characters"
    ).isLength({ max: 2000 }),
    check("price", "Price is required").isNumeric().isLength({ max: 10 }),
    check("category", "Category is mandatory").not().isEmpty(),
  ],
  isSignedIn,
  authenticated,
  isAdmin,
  createProduct
);

//Delete a product
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  authenticated,
  isAdmin,
  deleteProduct
);

//update a product
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  authenticated,
  isAdmin,
  updateProduct
);
module.exports = router;

//Get all products
router.get("/products",getAllProducts);

//Get all unique categories
router.get("/products/categories", uniqueCategories);
