import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function RestaurantDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/restaurants/${id}`).then(({ data }) => setRestaurant(data)).catch(console.error);
  }, [id]);

  const filteredMenu = restaurant?.menu?.filter(
    (m) => !search || m.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleAdd = async (item) => {
    if (!user) {
      setMessage("Please login to add items to cart");
      return;
    }
    const result = await addToCart({
      restaurantId: id,
      itemId: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage(`${item.name} added to cart!`);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (!restaurant) return <div className="max-w-4xl mx-auto px-4 py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-promart-red to-promart-orange flex items-center justify-center">
          <span className="text-8xl">🍽️</span>
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-gray-600 mt-1">{restaurant.description}</p>
          <p className="text-sm text-gray-500 mt-2">{restaurant.cuisine?.join(" • ")}</p>
          <div className="flex gap-4 mt-4">
            <span className="flex items-center gap-1 text-yellow-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">★</svg>
              {restaurant.rating?.toFixed(1)}
            </span>
            <span className="text-gray-500">{restaurant.deliveryTime} min delivery</span>
          </div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search in menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full py-2 px-4 rounded-lg border border-gray-200 mb-6"
      />

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes("added") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {filteredMenu.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center gap-4">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
              <p className="text-promart-red font-semibold mt-1">₹{item.price}</p>
            </div>
            <button
              onClick={() => handleAdd(item)}
              disabled={!item.available}
              className="bg-promart-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
            >
              Add
            </button>
          </div>
        ))}
      </div>
      {filteredMenu.length === 0 && <p className="text-gray-500 text-center py-8">No items found.</p>}
    </div>
  );
}
