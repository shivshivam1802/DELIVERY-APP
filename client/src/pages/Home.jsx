import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function RestaurantImage({ src, alt, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className={`bg-gray-200 overflow-hidden ${className}`}>
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
        <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
      )}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    api.get(`/restaurants${q}`).then(({ data }) => {
      setRestaurants(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => {
      setRestaurants([]);
      setLoading(false);
    });
  }, [search]);

  useEffect(() => {
    if (user) {
      api.get("/recommendations").then(({ data }) => {
        setRecommendations(data && Array.isArray(data.recommended) ? data : null);
      }).catch(() => {});
    }
  }, [user]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-promart-red via-red-600 to-promart-orange text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Order food from the best restaurants
            </h1>
            <p className="text-lg sm:text-xl opacity-95 mb-8">
              Discover restaurants, order your favorite meals, and get it delivered to your door.
            </p>
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="Search for restaurants or food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-4 pl-5 pr-14 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-promart-red text-white p-2 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Recommendations */}
        {Array.isArray(recommendations?.recommended) && recommendations.recommended.length > 0 && (
          <div className="mb-14">
            <h2 className="text-2xl font-bold mb-1 text-gray-900">Recommended for you</h2>
            <p className="text-gray-500 mb-6">{recommendations.basedOn}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.recommended.map((r) => (
                <Link key={r._id} to={`/restaurant/${r._id}`} className="restaurant-card block">
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden flex gap-4 p-4 border border-gray-100">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                      <RestaurantImage src={r.image} alt={r.name} className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="font-bold text-lg group-hover:text-promart-red transition truncate">{r.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{r.cuisine?.join(", ")}</p>
                      <div className="flex gap-3 mt-2">
                        <span className="flex items-center gap-1 text-amber-500 font-medium">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">★</svg>
                          {r.rating?.toFixed(1)}
                        </span>
                        <span className="text-gray-400 text-sm">{r.deliveryTime} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Restaurants Grid */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Restaurants near you</h2>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-100 rounded w-12" />
                    <div className="h-4 bg-gray-100 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !Array.isArray(restaurants) || restaurants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">No restaurants found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Array.isArray(restaurants) ? restaurants : []).map((r) => (
              <Link key={r._id} to={`/restaurant/${r._id}`} className="restaurant-card block group">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                  <div className="h-44 relative overflow-hidden">
                    <RestaurantImage
                      src={r.image}
                      alt={r.name}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-sm font-semibold text-amber-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">★</svg>
                      {r.rating?.toFixed(1)}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                      {r.deliveryTime} min
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg group-hover:text-promart-red transition">{r.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{r.cuisine?.join(", ")}</p>
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
