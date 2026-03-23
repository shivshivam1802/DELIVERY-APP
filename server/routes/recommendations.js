const router = require("express").Router();
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const { auth } = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 6;

    const pastOrders = await Order.find({ userId })
      .populate("restaurantId", "name cuisine menu rating image")
      .sort({ createdAt: -1 })
      .limit(20);

    const cuisineCount = {};
    const itemCount = {};
    const restaurantIds = new Set();

    pastOrders.forEach((o) => {
      if (o.restaurantId) {
        restaurantIds.add(String(o.restaurantId._id));
        (o.restaurantId.cuisine || []).forEach((c) => {
          cuisineCount[c] = (cuisineCount[c] || 0) + 1;
        });
        (o.items || []).forEach((i) => {
          itemCount[i.name] = (itemCount[i.name] || 0) + 1;
        });
      }
    });

    const topCuisines = Object.entries(cuisineCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([c]) => c);

    const topItems = Object.entries(itemCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([n]) => n);

    let recommendedRestaurants = [];

    if (topCuisines.length > 0) {
      recommendedRestaurants = await Restaurant.find({
        isActive: true,
        cuisine: { $in: topCuisines },
        _id: { $nin: Array.from(restaurantIds) },
      })
        .limit(limit)
        .select("name cuisine rating deliveryTime image");
    }

    if (recommendedRestaurants.length < limit) {
      const more = await Restaurant.find({
        isActive: true,
        _id: { $nin: recommendedRestaurants.map((r) => r._id).concat(Array.from(restaurantIds)) },
      })
        .sort({ rating: -1 })
        .limit(limit - recommendedRestaurants.length)
        .select("name cuisine rating deliveryTime image");
      recommendedRestaurants = [...recommendedRestaurants, ...more];
    }

    if (recommendedRestaurants.length < limit) {
      const popular = await Restaurant.find({ isActive: true })
        .sort({ rating: -1 })
        .limit(limit)
        .select("name cuisine rating deliveryTime image");
      const seen = new Set(recommendedRestaurants.map((r) => String(r._id)));
      popular.forEach((r) => {
        if (!seen.has(String(r._id)) && recommendedRestaurants.length < limit) {
          recommendedRestaurants.push(r);
          seen.add(String(r._id));
        }
      });
    }

    res.json({
      recommended: recommendedRestaurants.slice(0, limit),
      basedOn: topCuisines.length > 0 ? `Your love for ${topCuisines.join(", ")}` : "Popular near you",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/ai", auth, async (req, res) => {
  try {
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return res.status(503).json({
        error: "AI recommendations require OPENAI_API_KEY. Use /api/recommendations for rule-based suggestions.",
      });
    }
    let OpenAI;
    try {
      const mod = await import("openai");
      OpenAI = mod.default;
    } catch {
      return res.status(503).json({ error: "Install openai: npm install openai" });
    }

    const pastOrders = await Order.find({ userId: req.user._id })
      .populate("restaurantId", "name cuisine")
      .sort({ createdAt: -1 })
      .limit(10);

    const history = pastOrders
      .map((o) =>
        o.items?.map((i) => `${i.name} from ${o.restaurantId?.name} (${o.restaurantId?.cuisine?.join(", ")})`).join(", ")
      )
      .filter(Boolean)
      .join("; ") || "No orders yet";

    const openai = new OpenAI({ apiKey: OPENAI_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a food recommendation assistant. Suggest 3-4 specific dishes or cuisine types. Reply ONLY with valid JSON: {\"suggestions\":[\"item1\",\"item2\"],\"reason\":\"brief reason\"}",
        },
        { role: "user", content: `Order history: ${history}. Suggest personalized recommendations.` },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const json = JSON.parse(text.replace(/```\w*\n?/g, "").trim());
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
