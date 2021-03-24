const express = require("express");
const router = express.Router();
const {isSignedIn, authenticated, isAdmin } = require("../controllers/auth");
const {getUser,getUserById, getAllUsers, updateUser, userPurchaseList} = require("../controllers/user");

router.param("userId",getUserById);

router.get("/user/:userId", isSignedIn,authenticated,getUser);

router.get("/users", getAllUsers);

router.put("/user/:userId", isSignedIn,authenticated,updateUser);

router.get("/orders/user/userId",isSignedIn,authenticated,userPurchaseList)

module.exports = router;