import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users").then(({ data }) => setUsers(data)).catch(console.error);
  }, []);

  const toggleActive = async (id, isActive) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}`, { isActive });
      setUsers((prev) => prev.map((u) => (u._id === id ? data : u)));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    u.role === "admin" ? "bg-red-100" : u.role === "restaurant" ? "bg-blue-100" : "bg-gray-100"
                  }`}>{u.role}</span>
                </td>
                <td className="p-4">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
