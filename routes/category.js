const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { isSignedIn, authenticated, isAdmin } = require("../controllers/auth");
const {
  getCategoryById,
  getCategory,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/category");
const { getUserById } = require("../controllers/user");
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);
router.get("/category/:categoryId", getCategory);
router.post(
  "/category/create/:userId",[
    check("name","Name is required, max length can be 32 characters").isLength({max:32})
  ],
  isSignedIn,
  authenticated,
  isAdmin,
  createCategory
);
router.get("/category", getAllCategories);
router.put("/category/:categoryId/:userId",isSignedIn,authenticated,isAdmin,updateCategory);
router.delete("/category/:categoryId/:userId",isSignedIn,authenticated,isAdmin,deleteCategory);
module.exports = router;
