const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
try { require("dotenv").config(); } catch (_) {}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/promart";

const restaurants = [
  {
    name: "Spice Garden",
    description: "Authentic North Indian cuisine with a modern twist",
    cuisine: ["North Indian", "Mughlai"],
    address: { street: "123 MG Road", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
    location: { lat: 18.9388, lng: 72.8354 },
    rating: 4.5,
    deliveryTime: 30,
    menu: [
      { name: "Butter Chicken", description: "Creamy tomato-based curry", price: 280, category: "Main" },
      { name: "Paneer Tikka", description: "Grilled cottage cheese", price: 220, category: "Starter" },
      { name: "Dal Makhani", description: "Creamy black lentils", price: 180, category: "Main" },
      { name: "Garlic Naan", price: 60, category: "Bread" },
      { name: "Gulab Jamun", price: 80, category: "Dessert" },
    ],
  },
  {
    name: "Pizza Paradise",
    description: "Wood-fired pizzas and Italian delights",
    cuisine: ["Italian", "Continental"],
    address: { street: "45 Linking Road", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    location: { lat: 19.0602, lng: 72.8295 },
    rating: 4.3,
    deliveryTime: 25,
    menu: [
      { name: "Margherita Pizza", description: "Classic tomato and mozzarella", price: 299, category: "Pizza" },
      { name: "Pepperoni Pizza", description: "Spicy pepperoni with cheese", price: 399, category: "Pizza" },
      { name: "Garlic Bread", price: 149, category: "Sides" },
      { name: "Pasta Alfredo", price: 249, category: "Pasta" },
      { name: "Tiramisu", price: 199, category: "Dessert" },
    ],
  },
  {
    name: "Dosa Corner",
    description: "South Indian breakfast and meals",
    cuisine: ["South Indian"],
    address: { street: "78 Park Street", city: "Mumbai", state: "Maharashtra", pincode: "400016" },
    location: { lat: 18.9878, lng: 72.8219 },
    rating: 4.6,
    deliveryTime: 20,
    menu: [
      { name: "Masala Dosa", description: "Crispy dosa with potato filling", price: 120, category: "Dosa" },
      { name: "Idli Sambar", description: "Steamed rice cakes", price: 80, category: "Breakfast" },
      { name: "Uttapam", description: "Thick rice pancake", price: 100, category: "Dosa" },
      { name: "Filter Coffee", price: 50, category: "Beverages" },
      { name: "Medu Vada", price: 70, category: "Snacks" },
    ],
  },
  {
    name: "Burger Hub",
    description: "Gourmet burgers and shakes",
    cuisine: ["American", "Fast Food"],
    address: { street: "22 Bandra West", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    location: { lat: 19.0596, lng: 72.8295 },
    rating: 4.2,
    deliveryTime: 25,
    menu: [
      { name: "Classic Cheeseburger", price: 199, category: "Burgers" },
      { name: "Chicken Burger", price: 249, category: "Burgers" },
      { name: "French Fries", price: 99, category: "Sides" },
      { name: "Chocolate Shake", price: 149, category: "Beverages" },
      { name: "Onion Rings", price: 129, category: "Sides" },
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
    console.log("Restaurants seeded");

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
