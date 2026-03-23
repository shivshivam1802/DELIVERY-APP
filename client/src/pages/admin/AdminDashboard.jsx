import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data)).catch(console.error);
  }, []);

  if (!stats) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Users</p>
          <p className="text-3xl font-bold text-promart-red">{stats.userCount}</p>
          <Link to="/admin/users" className="text-promart-red text-sm mt-2 block">View</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Restaurants</p>
          <p className="text-3xl font-bold">{stats.restaurantCount}</p>
          <Link to="/admin/restaurants" className="text-promart-red text-sm mt-2 block">View</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold">{stats.orderCount}</p>
          <Link to="/admin/orders" className="text-promart-red text-sm mt-2 block">View</Link>
        </div>
      </div>

      <h2 className="font-semibold mb-4">Recent Orders</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {stats.recentOrders?.length === 0 ? (
          <p className="p-6 text-gray-500">No orders.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Restaurant</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="p-4">{o.restaurantId?.name}</td>
                  <td className="p-4">{o.status}</td>
                  <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
