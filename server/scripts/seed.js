const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
try { require("dotenv").config(); } catch (_) {}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/promart";

const restaurants = [
  {
    name: "Spice Garden",
    description: "Authentic North Indian cuisine with a modern twist. Best butter chicken in town!",
    cuisine: ["North Indian", "Mughlai"],
    address: { street: "123 MG Road", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
    location: { lat: 18.9388, lng: 72.8354 },
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    rating: 4.5,
    deliveryTime: 30,
    menu: [
      { name: "Butter Chicken", description: "Creamy tomato-based curry with tender chicken", price: 280, category: "Main", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400" },
      { name: "Paneer Tikka", description: "Grilled cottage cheese with spices", price: 220, category: "Starter", image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400" },
      { name: "Dal Makhani", description: "Creamy black lentils slow-cooked", price: 180, category: "Main", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },
      { name: "Garlic Naan", description: "Soft bread with garlic butter", price: 60, category: "Bread", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" },
      { name: "Gulab Jamun", description: "Sweet milk dumplings in syrup", price: 80, category: "Dessert", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400" },
      { name: "Chicken Biryani", description: "Fragrant basmati rice with spiced chicken", price: 320, category: "Main", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400" },
      { name: "Tandoori Chicken", description: "Clay oven roasted chicken", price: 350, category: "Main", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400" },
    ],
  },
  {
    name: "Pizza Paradise",
    description: "Wood-fired pizzas and Italian delights. Fresh dough daily!",
    cuisine: ["Italian", "Continental"],
    address: { street: "45 Linking Road", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    location: { lat: 19.0602, lng: 72.8295 },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    rating: 4.3,
    deliveryTime: 25,
    menu: [
      { name: "Margherita Pizza", description: "Classic tomato and mozzarella", price: 299, category: "Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400" },
      { name: "Pepperoni Pizza", description: "Spicy pepperoni with cheese", price: 399, category: "Pizza", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400" },
      { name: "Garlic Bread", description: "Crispy bread with garlic butter", price: 149, category: "Sides", image: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400" },
      { name: "Pasta Alfredo", description: "Creamy white sauce pasta", price: 249, category: "Pasta", image: "https://images.unsplash.com/photo-1645112050892-ebb92ce8e9c9?w=400" },
      { name: "Tiramisu", description: "Classic Italian coffee dessert", price: 199, category: "Dessert", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400" },
      { name: "Veggie Supreme Pizza", description: "Loaded with fresh vegetables", price: 349, category: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400" },
      { name: "Lasagna", description: "Layered pasta with meat sauce", price: 279, category: "Pasta", image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400" },
    ],
  },
  {
    name: "Dosa Corner",
    description: "South Indian breakfast and meals. Crispy dosas made to order!",
    cuisine: ["South Indian"],
    address: { street: "78 Park Street", city: "Mumbai", state: "Maharashtra", pincode: "400016" },
    location: { lat: 18.9878, lng: 72.8219 },
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    rating: 4.6,
    deliveryTime: 20,
    menu: [
      { name: "Masala Dosa", description: "Crispy dosa with potato filling", price: 120, category: "Dosa", image: "https://images.unsplash.com/photo-1630386530003-7c5303e2a0f7?w=400" },
      { name: "Idli Sambar", description: "Steamed rice cakes with lentil soup", price: 80, category: "Breakfast", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400" },
      { name: "Uttapam", description: "Thick rice pancake with toppings", price: 100, category: "Dosa", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400" },
      { name: "Filter Coffee", description: "Strong South Indian filter coffee", price: 50, category: "Beverages", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400" },
      { name: "Medu Vada", description: "Crispy lentil donuts", price: 70, category: "Snacks", image: "https://images.unsplash.com/photo-1604329760661-e71dc83f2b26?w=400" },
      { name: "Plain Dosa", description: "Classic crispy rice crepe", price: 90, category: "Dosa", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400" },
      { name: "Rava Dosa", description: "Crispy semolina dosa", price: 110, category: "Dosa", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400" },
    ],
  },
  {
    name: "Burger Hub",
    description: "Gourmet burgers and shakes. Juicy patties, fresh buns!",
    cuisine: ["American", "Fast Food"],
    address: { street: "22 Bandra West", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    location: { lat: 19.0596, lng: 72.8295 },
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
    rating: 4.2,
    deliveryTime: 25,
    menu: [
      { name: "Classic Cheeseburger", description: "Beef patty with cheddar cheese", price: 199, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
      { name: "Chicken Burger", description: "Crispy chicken with mayo", price: 249, category: "Burgers", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400" },
      { name: "French Fries", description: "Golden crispy fries", price: 99, category: "Sides", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400" },
      { name: "Chocolate Shake", description: "Rich chocolate milkshake", price: 149, category: "Beverages", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400" },
      { name: "Onion Rings", description: "Crispy battered onion rings", price: 129, category: "Sides", image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400" },
      { name: "Veggie Burger", description: "Plant-based patty with veggies", price: 179, category: "Burgers", image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=400" },
      { name: "Double Patty Burger", description: "Two beef patties, double cheese", price: 329, category: "Burgers", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400" },
    ],
  },
  {
    name: "Biryani Blues",
    description: "Hyderabadi biryani specialists. Dum-cooked perfection!",
    cuisine: ["North Indian", "Mughlai", "Biryani"],
    address: { street: "56 Andheri West", city: "Mumbai", state: "Maharashtra", pincode: "400058" },
    location: { lat: 19.1334, lng: 72.8467 },
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
    rating: 4.7,
    deliveryTime: 35,
    menu: [
      { name: "Chicken Biryani", description: "Hyderabadi style dum biryani", price: 299, category: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400" },
      { name: "Mutton Biryani", description: "Tender mutton with basmati rice", price: 399, category: "Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" },
      { name: "Veg Biryani", description: "Mixed vegetables biryani", price: 199, category: "Biryani", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400" },
      { name: "Raita", description: "Cool yogurt side", price: 49, category: "Sides", image: "https://images.unsplash.com/photo-1571212515416-f3b2d5d0630b?w=400" },
      { name: "Mirchi Ka Salan", description: "Spicy pepper curry", price: 89, category: "Sides", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400" },
      { name: "Egg Biryani", description: "Boiled eggs with biryani rice", price: 229, category: "Biryani", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400" },
    ],
  },
  {
    name: "China Town",
    description: "Authentic Chinese cuisine. Wok-tossed to perfection!",
    cuisine: ["Chinese", "Asian"],
    address: { street: "34 Juhu", city: "Mumbai", state: "Maharashtra", pincode: "400049" },
    location: { lat: 19.1073, lng: 72.8378 },
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800",
    rating: 4.4,
    deliveryTime: 28,
    menu: [
      { name: "Kung Pao Chicken", description: "Spicy stir-fried chicken with peanuts", price: 299, category: "Main", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400" },
      { name: "Fried Rice", description: "Wok-fried rice with vegetables", price: 199, category: "Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400" },
      { name: "Spring Rolls", description: "Crispy veg spring rolls", price: 149, category: "Starters", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400" },
      { name: "Hakka Noodles", description: "Stir-fried noodles", price: 189, category: "Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a2448952b79?w=400" },
      { name: "Manchurian", description: "Crispy balls in spicy sauce", price: 179, category: "Starters", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400" },
      { name: "Sweet Corn Soup", description: "Creamy corn soup", price: 99, category: "Soups", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400" },
    ],
  },
  {
    name: "Cafe Mocha",
    description: "Coffee, sandwiches & desserts. Your perfect hangout!",
    cuisine: ["Cafe", "Continental", "Desserts"],
    address: { street: "12 Colaba", city: "Mumbai", state: "Maharashtra", pincode: "400005" },
    location: { lat: 18.9220, lng: 72.8347 },
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    rating: 4.5,
    deliveryTime: 22,
    menu: [
      { name: "Cappuccino", description: "Espresso with steamed milk foam", price: 149, category: "Coffee", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400" },
      { name: "Club Sandwich", description: "Triple-decker veg/non-veg", price: 249, category: "Sandwiches", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400" },
      { name: "Chocolate Brownie", description: "Warm brownie with ice cream", price: 179, category: "Desserts", image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400" },
      { name: "Cold Coffee", description: "Iced coffee with cream", price: 129, category: "Coffee", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400" },
      { name: "Paneer Wrap", description: "Grilled paneer in tortilla", price: 199, category: "Sandwiches", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400" },
      { name: "Red Velvet Cake", description: "Classic red velvet slice", price: 199, category: "Desserts", image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400" },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const hash = await bcrypt.hash("admin123", 10);
    const admin = await User.findOneAndUpdate(
      { email: "admin@promart.com" },
      { name: "Admin", email: "admin@promart.com", password: hash, role: "admin" },
      { upsert: true, new: true }
    );
    console.log("Admin created:", admin.email);

    const userHash = await bcrypt.hash("user123", 10);
    const user = await User.findOneAndUpdate(
      { email: "user@promart.com" },
      { name: "Test User", email: "user@promart.com", password: userHash, role: "user", address: { street: "Test St", city: "Mumbai", pincode: "400001", lat: 18.9750, lng: 72.8460 } },
      { upsert: true, new: true }
    );
    console.log("Test user created:", user.email);

    for (const r of restaurants) {
      await Restaurant.findOneAndUpdate({ name: r.name }, r, { upsert: true, new: true });
    }
    console.log("Restaurants seeded:", restaurants.length);

    const rest = await Restaurant.findOne({ name: "Spice Garden" });
    const restHash = await bcrypt.hash("restaurant123", 10);
    await User.findOneAndUpdate(
      { email: "restaurant@promart.com" },
      { name: "Spice Garden Owner", email: "restaurant@promart.com", password: restHash, role: "restaurant", restaurantId: rest._id },
      { upsert: true, new: true }
    );
    console.log("Restaurant user created");

    console.log("Seed completed!");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
