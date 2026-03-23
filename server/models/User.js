const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number,
  },
  role: { type: String, enum: ["user", "restaurant", "admin"], default: "user" },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", default: null },
  isActive: { type: Boolean, default: true },
  pushSubscription: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
