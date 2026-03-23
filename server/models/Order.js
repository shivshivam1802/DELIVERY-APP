const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant.menu" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number,
  },
  deliveryLocation: { lat: Number, lng: Number },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending",
  },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  paymentId: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
