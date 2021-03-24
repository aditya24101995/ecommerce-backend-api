const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, orderjson) => {
      if (err) {
        return res.status(400).json({
          error: "No such order found",
        });
      }
      req.order = orderjson;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, ordersave) => {
    if (err) {
      return res.status(400).json({
        error: "Order creation failed",
      });
    }
    res.json(ordersave);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, ordersjson) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found in the database",
        });
      }
      res.json(ordersjson);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, updateorder) => {
      if (err) {
        return res.status(400).json({
          error: "Can't update the order status",
        });
      }
      res.json(updateorder);
    }
  );
};
