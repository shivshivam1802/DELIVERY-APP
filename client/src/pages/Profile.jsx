import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState(user?.address?.street || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [pincode, setPincode] = useState(user?.address?.pincode || "");
  const [lat, setLat] = useState(user?.address?.lat ?? null);
  const [lng, setLng] = useState(user?.address?.lng ?? null);
  const [message, setMessage] = useState("");

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setMessage("Location captured! Save profile to apply.");
      },
      () => setMessage("Could not get location")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        phone,
        address: { street, city, pincode, lat: lat || undefined, lng: lng || undefined },
      });
      setMessage("Profile updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Update failed");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input type="email" value={user.email} disabled className="w-full py-2 px-3 rounded border bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full py-2 px-3 rounded border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full py-2 px-3 rounded border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
          <input
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full py-2 px-3 rounded border mb-2"
          />
          <div className="flex gap-2">
            <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="flex-1 py-2 px-3 rounded border" />
            <input placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-24 py-2 px-3 rounded border" />
          </div>
          <button
            type="button"
            onClick={useMyLocation}
            className="mt-2 text-sm text-promart-red hover:underline"
          >
            📍 Use my current location (for delivery tracking)
          </button>
          {lat != null && lng != null && (
            <p className="text-xs text-gray-500 mt-1">Location: {lat.toFixed(4)}, {lng.toFixed(4)}</p>
          )}
        </div>
        {message && <p className={message.includes("updated") ? "text-green-600" : "text-red-500"}>{message}</p>}
        <button type="submit" className="w-full bg-promart-red text-white py-2 rounded-lg font-semibold hover:bg-red-600">
          Update Profile
        </button>
      </form>
    </div>
  );
}
