const router = require("express").Router();
const Order = require("../models/Order");
const { auth, isRestaurant, isAdmin } = require("../middleware/auth");

router.patch("/orders/:id/location", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const isRestaurantOwner = req.user.restaurantId && String(order.restaurantId) === String(req.user.restaurantId);
    if (!isRestaurantOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    const { lat, lng } = req.body;
    if (lat == null || lng == null) return res.status(400).json({ error: "lat and lng required" });
    order.deliveryLocation = { lat, lng };
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
