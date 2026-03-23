import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    if (user?.restaurantId) {
      api.get(`/restaurants/${user.restaurantId}`).then(({ data }) => setRestaurant(data));
      api.get("/orders").then(({ data }) => setOrders(data.filter(o => o.status !== "Delivered" && o.status !== "Cancelled")));
    }
  }, [user]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  if (!user?.restaurantId) return <div className="p-8">No restaurant linked.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{restaurant?.name || "Dashboard"}</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Active Orders</p>
          <p className="text-3xl font-bold text-promart-red">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Menu Items</p>
          <p className="text-3xl font-bold">{restaurant?.menu?.length || 0}</p>
        </div>
      </div>

      <h2 className="font-semibold mb-4">Pending Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No pending orders.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{o.userId?.name}</p>
                  <p className="text-sm text-gray-500">₹{o.total}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 rounded text-sm">{o.status}</span>
              </div>
              <ul className="text-sm text-gray-600 mb-3">
                {o.items?.map((i, idx) => (
                  <li key={idx}>{i.name} x {i.quantity}</li>
                ))}
              </ul>
              {o.status === "Pending" && (
                <button onClick={() => updateStatus(o._id, "Confirmed")} className="bg-promart-orange text-white px-4 py-1 rounded mr-2">
                  Confirm
                </button>
              )}
              {o.status === "Confirmed" && (
                <button onClick={() => updateStatus(o._id, "Preparing")} className="bg-blue-500 text-white px-4 py-1 rounded mr-2">
                  Preparing
                </button>
              )}
              {o.status === "Preparing" && (
                <button onClick={() => updateStatus(o._id, "Out for Delivery")} className="bg-purple-500 text-white px-4 py-1 rounded mr-2">
                  Out for Delivery
                </button>
              )}
              {o.status === "Out for Delivery" && (
                <button onClick={() => updateStatus(o._id, "Delivered")} className="bg-green-500 text-white px-4 py-1 rounded">
                  Delivered
                </button>
              )}
              <button onClick={() => updateStatus(o._id, "Cancelled")} className="text-red-500 ml-2">Cancel</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
