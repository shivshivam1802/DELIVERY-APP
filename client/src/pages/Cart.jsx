import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import { useState } from "react";

function Img({ src, alt }) {
  const [error, setError] = useState(false);
  if (error || !src) return <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">🍽️</div>;
  return (
    <img
      src={src}
      alt={alt}
      className="w-16 h-16 object-cover rounded-lg"
      onError={() => setError(true)}
    />
  );
}

export default function Cart() {
  const { user } = useAuth();
  const { cart, cartTotal, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user || cart.items?.length === 0) return;
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
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-xl font-bold mb-2">Login to view cart</h2>
          <p className="text-gray-500 mb-6">Sign in to add items and place orders</p>
          <Link to="/login" className="inline-block bg-promart-red text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (cart.items?.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <p className="text-7xl mb-4">🛒</p>
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add items from a restaurant to get started</p>
          <Link to="/" className="inline-block bg-promart-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="space-y-4">
        {cart.items?.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-md p-5 flex gap-4 items-center border border-gray-100">
            <Img src={item.image} alt={item.name} />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-promart-red font-bold">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => updateQuantity(idx, (item.quantity || 1) - 1)}
                className="w-9 h-9 rounded-lg bg-white shadow hover:bg-gray-50 font-medium"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(idx, (item.quantity || 1) + 1)}
                className="w-9 h-9 rounded-lg bg-white shadow hover:bg-gray-50 font-medium"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-600">Subtotal</span>
          <span className="text-2xl font-bold text-promart-red">₹{cartTotal}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="w-full bg-promart-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50"
        >
          {placing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
