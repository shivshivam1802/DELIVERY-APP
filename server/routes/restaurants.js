const router = require("express").Router();
const Restaurant = require("../models/Restaurant");
const { auth, isRestaurant, isAdmin } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const { search, cuisine } = req.query;
    let filter = { isActive: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { "menu.name": { $regex: search, $options: "i" } },
        { cuisine: { $regex: search, $options: "i" } },
      ];
    }
    if (cuisine) filter.cuisine = { $in: [new RegExp(cuisine, "i")] };
    const restaurants = await Restaurant.find(filter).select("-__v");
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    if (req.user.role === "restaurant" && String(req.user.restaurantId) !== String(req.params.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }
    Object.assign(restaurant, req.body);
    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/menu", auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    if (req.user.role === "restaurant" && String(req.user.restaurantId) !== String(req.params.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }
    restaurant.menu.push(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/menu/:menuId", auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    if (req.user.role === "restaurant" && String(req.user.restaurantId) !== String(req.params.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }
    const item = restaurant.menu.id(req.params.menuId);
    if (!item) return res.status(404).json({ error: "Menu item not found" });
    Object.assign(item, req.body);
    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id/menu/:menuId", auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    if (req.user.role === "restaurant" && String(req.user.restaurantId) !== String(req.params.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }
    restaurant.menu.pull(req.params.menuId);
    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
