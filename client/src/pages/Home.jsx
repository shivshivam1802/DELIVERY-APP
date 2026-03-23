import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    api.get(`/restaurants${q}`).then(({ data }) => {
      setRestaurants(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    if (user) {
      api.get("/recommendations").then(({ data }) => setRecommendations(data)).catch(() => {});
    }
  }, [user]);

  return (
    <div>
      <div className="bg-gradient-to-r from-promart-red to-promart-orange text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Order food from the best restaurants</h1>
          <p className="text-lg opacity-90 mb-6">Discover restaurants and order your favorite meals.</p>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for restaurants or food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-3 pl-5 pr-12 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {recommendations?.recommended?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-2">Recommended for you</h2>
            <p className="text-gray-500 text-sm mb-4">{recommendations.basedOn}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.recommended.map((r) => (
                <Link key={r._id} to={`/restaurant/${r._id}`} className="group">
                  <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex gap-4 p-4 border border-gray-100">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-3xl">🍽️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold group-hover:text-promart-red transition truncate">{r.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{r.cuisine?.join(", ")}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-yellow-500 text-sm">★ {r.rating?.toFixed(1)}</span>
                        <span className="text-gray-400 text-sm">{r.deliveryTime} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Restaurants near you</h2>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow animate-pulse h-64" />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No restaurants found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <Link key={r._id} to={`/restaurant/${r._id}`} className="group">
                <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <span className="text-6xl">🍽️</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg group-hover:text-promart-red transition">{r.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{r.cuisine?.join(", ")}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="flex items-center gap-1 text-yellow-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">★</svg>
                        {r.rating?.toFixed(1) || "4.0"}
                      </span>
                      <span className="text-sm text-gray-500">{r.deliveryTime || 30} min</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
