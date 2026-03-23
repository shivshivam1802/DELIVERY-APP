import { useState } from "react";
import api from "../../api/axios";

export default function DriverLocationSimulator({ order, onUpdated }) {
  const [simulating, setSimulating] = useState(false);

  const mumbaiPath = [
    { lat: 18.9388, lng: 72.8354 },
    { lat: 18.9450, lng: 72.8380 },
    { lat: 18.9520, lng: 72.8400 },
    { lat: 18.9600, lng: 72.8420 },
    { lat: 18.9680, lng: 72.8440 },
    { lat: 18.9750, lng: 72.8460 },
    { lat: 18.9820, lng: 72.8480 },
  ];

  const simulateDelivery = async () => {
    if (order.status !== "Out for Delivery") return;
    setSimulating(true);
    for (let i = 0; i < mumbaiPath.length; i++) {
      await api.patch(`/location/orders/${order._id}/location`, mumbaiPath[i]);
      onUpdated?.();
      await new Promise((r) => setTimeout(r, 2000));
    }
    setSimulating(false);
  };

  if (order.status !== "Out for Delivery") return null;

  return (
    <button
      onClick={simulateDelivery}
      disabled={simulating}
      className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {simulating ? "Simulating..." : "📍 Simulate driver movement"}
    </button>
  );
}
