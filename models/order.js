const mongoose = require("mongoose");
//const { Objectid } = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});
const ProductCart = mongoose.model("ProductCart", productCartSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [productCartSchema],
    transactionid: {},
    address: String,
    status:{
      type:String,
      default:"Recieved",
      enum:["Cancelled","Processing","Recieved","Completed","OnHold"]
    },
    amount: { type: Number },
    updated: Date,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };
