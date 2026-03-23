import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function RestaurantMenu() {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Main");

  useEffect(() => {
    if (user?.restaurantId) {
      api.get(`/restaurants/${user.restaurantId}`).then(({ data }) => setRestaurant(data));
    }
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/restaurants/${user.restaurantId}/menu`, {
        name,
        description,
        price: parseFloat(price),
        category,
      });
      setRestaurant(data);
      setName("");
      setDescription("");
      setPrice("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  const handleDelete = async (menuId) => {
    if (!confirm("Delete this item?")) return;
    try {
      const { data } = await api.delete(`/restaurants/${user.restaurantId}/menu/${menuId}`);
      setRestaurant(data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  if (!user?.restaurantId) return <div className="p-8">No restaurant linked.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Menu</h1>

      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-4">Add Item</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="py-2 px-3 rounded border"
          />
          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="py-2 px-3 rounded border"
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="py-2 px-3 rounded border sm:col-span-2"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="py-2 px-3 rounded border">
            <option>Main</option>
            <option>Starter</option>
            <option>Dessert</option>
            <option>Beverages</option>
            <option>Sides</option>
          </select>
        </div>
        <button type="submit" className="mt-4 bg-promart-orange text-white px-6 py-2 rounded-lg">
          Add Item
        </button>
      </form>

      <h2 className="font-semibold mb-4">Menu Items</h2>
      <div className="space-y-2">
        {(Array.isArray(restaurant?.menu) ? restaurant.menu : []).map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.description || item.category}</p>
              <p className="text-promart-red font-semibold">₹{item.price}</p>
            </div>
            <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">
              Delete
            </button>
          </div>
        ))}
      </div>
      {(!restaurant?.menu || restaurant.menu.length === 0) && (
        <p className="text-gray-500">No menu items yet.</p>
      )}
    </div>
  );
}
