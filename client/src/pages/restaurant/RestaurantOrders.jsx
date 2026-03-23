import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import DriverLocationSimulator from "./DriverLocationSimulator";

export default function RestaurantOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(() => {
    if (user) api.get("/orders").then(({ data }) => setOrders(Array.isArray(data) ? data : [])).catch(() => setOrders([]));
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => (Array.isArray(prev) ? prev : []).map((o) => (o._id === orderId ? { ...o, status } : o)));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{o.userId?.name}</p>
                  <p className="text-sm text-gray-500">₹{o.total} • {new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  o.status === "Delivered" ? "bg-green-100" : o.status === "Cancelled" ? "bg-red-100" : "bg-yellow-100"
                }`}>{o.status}</span>
              </div>
              <ul className="text-sm text-gray-600 my-2">
                {(Array.isArray(o.items) ? o.items : []).map((i, idx) => (
                  <li key={idx}>{i.name} x {i.quantity}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 items-center mt-2">
                {o.status !== "Delivered" && o.status !== "Cancelled" && (
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Preparing</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                )}
                <DriverLocationSimulator order={o} onUpdated={fetchOrders} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
