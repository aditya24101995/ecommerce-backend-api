const express = require("express");
const router = express.Router();
const { isSignedIn, authenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const { getOrderById, createOrder, getAllOrders, getOrderStatus, updateOrderStatus } = require("../controllers/order");
//get order id from params
router.param("orderId", getOrderById);
//get user id from param
router.param("userId", getUserById);

//create Order
router.post("/order/create/:userId",isSignedIn, authenticated,pushOrderInPurchaseList,updateStock,createOrder);


// get all orders 
router.get("/orders/:userId",isSignedIn, authenticated, isAdmin, getAllOrders);

//get Order status
router.get("/order/status/:userId",isSignedIn, authenticated, isAdmin, getOrderStatus);

//update order
router.put("/order/:orderId/status/:userId",isSignedIn, authenticated, isAdmin, updateOrderStatus)
