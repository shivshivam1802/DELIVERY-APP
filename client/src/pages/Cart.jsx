import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import { useState } from "react";

export default function Cart() {
  const { user } = useAuth();
  const { cart, cartTotal, updateQuantity, clearCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user || cart.items.length === 0) return;
    setPlacing(true);
    try {
      const items = cart.items.map((i) => ({
        itemId: i.itemId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        restaurantId: i.restaurantId,
      }));
      await api.post("/orders", {
        items,
        total: cartTotal,
        deliveryAddress: user.address || { street: "Address", city: "City", pincode: "000000" },
      });
      await clearCart();
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-4">Please login to view your cart</p>
        <Link to="/login" className="text-promart-red font-semibold">Login</Link>
      </div>
    );
  }

  if (cart.items?.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-4xl mb-4">🛒</p>
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add items from a restaurant to get started</p>
        <Link to="/" className="bg-promart-red text-white px-6 py-2 rounded-lg">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.items?.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-promart-red font-semibold">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(idx, (item.quantity || 1) - 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(idx, (item.quantity || 1) + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <div className="flex justify-between text-lg font-semibold mb-4">
          <span>Total</span>
          <span>₹{cartTotal}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="w-full bg-promart-orange text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
        >
          {placing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
