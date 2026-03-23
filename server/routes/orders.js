const router = require("express").Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { auth } = require("../middleware/auth");
const { sendPushNotification } = require("./notifications");

router.post("/", auth, async (req, res) => {
  try {
    const { items, total, deliveryAddress } = req.body;
    const addr = deliveryAddress || req.user.address || {};
    const order = new Order({
      userId: req.user._id,
      restaurantId: items[0]?.restaurantId,
      items,
      total,
      deliveryAddress: typeof addr === "object" ? addr : { street: "Address", city: "City", pincode: "" },
      paymentStatus: "Paid",
    });
    await order.save();
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    let orders;
    if (req.user.role === "admin") {
      orders = await Order.find().populate("userId", "name email").populate("restaurantId", "name");
    } else if (req.user.role === "restaurant") {
      orders = await Order.find({ restaurantId: req.user.restaurantId }).populate("userId", "name email");
    } else {
      orders = await Order.find({ userId: req.user._id }).populate("restaurantId", "name image");
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("restaurantId", "name address location");
    if (!order) return res.status(404).json({ error: "Order not found" });
    const isOwner = String(order.userId._id) === String(req.user._id);
    const isRestaurantOwner = req.user.restaurantId && String(order.restaurantId._id) === String(req.user.restaurantId);
    if (!isOwner && !isRestaurantOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/status", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const isRestaurantOwner = req.user.restaurantId && String(order.restaurantId) === String(req.user.restaurantId);
    if (!isRestaurantOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    const { status } = req.body;
    const valid = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!valid.includes(status)) return res.status(400).json({ error: "Invalid status" });
    order.status = status;
    await order.save();
    const populated = await Order.findById(order._id).populate("restaurantId", "name");
    sendPushNotification(order.userId, {
      title: "Order Update",
      body: `Your order from ${populated.restaurantId?.name} is ${status}`,
    }).catch(() => {});
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
