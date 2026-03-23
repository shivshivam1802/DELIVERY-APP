const router = require("express").Router();
const Cart = require("../models/Cart");
const { auth } = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate("items.restaurantId", "name");
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = new Cart({ userId: req.user._id, items: [] });
    const { restaurantId, itemId, name, price, quantity, image } = req.body;
    const existing = cart.items.find(
      (i) => String(i.restaurantId) === String(restaurantId) && String(i.itemId) === String(itemId)
    );
    if (existing) {
      existing.quantity += quantity || 1;
    } else {
      if (cart.items.length > 0 && String(cart.items[0].restaurantId) !== String(restaurantId)) {
        return res.status(400).json({ error: "Can only add items from one restaurant at a time. Clear cart first." });
      }
      cart.items.push({ restaurantId, itemId, name, price, quantity: quantity || 1, image: image || "" });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:itemIndex", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    const idx = parseInt(req.params.itemIndex);
    if (idx < 0 || idx >= cart.items.length) return res.status(404).json({ error: "Item not found" });
    const { quantity } = req.body;
    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] }, { new: true });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
