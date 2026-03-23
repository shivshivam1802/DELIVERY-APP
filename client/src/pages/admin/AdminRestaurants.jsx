import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    api.get("/admin/restaurants").then(({ data }) => setRestaurants(Array.isArray(data) ? data : [])).catch(() => setRestaurants([]));
  }, []);

  const toggleActive = async (id, isActive) => {
    try {
      const { data } = await api.patch(`/admin/restaurants/${id}`, { isActive });
      setRestaurants((prev) => (Array.isArray(prev) ? prev : []).map((r) => (r._id === id ? data : r)));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Restaurants</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Array.isArray(restaurants) ? restaurants : []).map((r) => (
          <div key={r._id} className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold">{r.name}</h3>
            <p className="text-sm text-gray-500">{r.cuisine?.join(", ")}</p>
            <p className="text-sm text-gray-500">{r.menu?.length || 0} items</p>
            <button
              onClick={() => toggleActive(r._id, !r.isActive)}
              className={`mt-2 px-3 py-1 rounded text-sm ${r.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {r.isActive ? "Active" : "Inactive"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
