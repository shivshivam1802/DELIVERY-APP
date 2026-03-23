import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/admin/orders").then(({ data }) => setOrders(Array.isArray(data) ? data : [])).catch(() => setOrders([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Restaurant</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(orders) ? orders : []).map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-4">{o.userId?.name}</td>
                <td className="p-4">{o.restaurantId?.name}</td>
                <td className="p-4">₹{o.total}</td>
                <td className="p-4">{o.status}</td>
                <td className="p-4">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
