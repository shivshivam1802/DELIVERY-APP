const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  category: { type: String, default: "Main" },
  image: { type: String, default: "" },
  available: { type: Boolean, default: true },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  cuisine: [{ type: String }],
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  location: { lat: Number, lng: Number },
  image: { type: String, default: "" },
  rating: { type: Number, default: 4.0 },
  deliveryTime: { type: Number, default: 30 },
  menu: [menuItemSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);
