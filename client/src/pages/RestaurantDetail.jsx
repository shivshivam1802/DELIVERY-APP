import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Img({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className={`overflow-hidden ${className}`}>
      {!error && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      {(!loaded || error) && (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl min-h-[120px]">🍽️</div>
      )}
    </div>
  );
}

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
  const categories = [...new Set(filteredMenu.map((m) => m.category))];

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
      image: item.image,
    });
    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage(`${item.name} added to cart!`);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-2xl mb-6" />
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Restaurant Header */}
      <div className="relative">
        <div className="h-64 sm:h-80 bg-gray-200">
          <Img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-32" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">{restaurant.name}</h1>
            <p className="text-white/90 text-sm mt-1">{restaurant.cuisine?.join(" • ")}</p>
            <div className="flex gap-4 mt-3">
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">★</svg>
                {restaurant.rating?.toFixed(1)}
              </span>
              <span className="text-white/90 text-sm">{restaurant.deliveryTime} min delivery</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <p className="text-gray-600">{restaurant.description}</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search in menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 pl-5 pr-12 rounded-xl border-2 border-gray-200 focus:border-promart-red focus:outline-none transition-colors"
          />
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl ${message.includes("added") ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            {message}
          </div>
        )}

        {/* Menu by Category */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-promart-orange rounded-full" />
                {category}
              </h2>
              <div className="space-y-4">
                {filteredMenu.filter((m) => m.category === category).map((item) => (
                  <div
                    key={item._id}
                    className="menu-item-card bg-white rounded-2xl shadow-md p-4 sm:p-5 flex gap-4 sm:gap-5 border-2 border-transparent"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      <Img src={item.image} alt={item.name} className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                      )}
                      <p className="text-promart-red font-bold text-lg mt-2">₹{item.price}</p>
                    </div>
                    <button
                      onClick={() => handleAdd(item)}
                      disabled={!item.available}
                      className="shrink-0 bg-promart-orange hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 h-fit"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-5xl mb-4">🍴</p>
            <p className="text-gray-500">No items found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
