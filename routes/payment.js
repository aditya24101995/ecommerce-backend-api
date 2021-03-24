const express = require("express");
//const { isAuthenticated } = require("../../projfrontend/src/auth/helper");
const router = express.Router()
const { isSignedIn, authenticated} = require("../controllers/auth");
const {getToken,processPayment} = require("../controllers/payment");
const { getUserById } = require("../controllers/user");
router.param("userId", getUserById);

router.get("/payment/gettoken/:userId", isSignedIn, authenticated, getToken);

router.post("/payment/braintree/:userId",isSignedIn, authenticated, processPayment);

module.exports = router;