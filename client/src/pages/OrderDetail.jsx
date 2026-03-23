import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import OrderMap from "../components/OrderMap";

const STEPS = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const fetchOrder = () => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(console.error);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!order || order.status !== "Out for Delivery") return;
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [order?.status, id]);

  if (!order) return <div className="max-w-2xl mx-auto px-4 py-12">Loading...</div>;

  const stepIndex = STEPS.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";
  const showMap = !isCancelled && (
    order.restaurantId?.location ||
    order.deliveryAddress?.lat ||
    order.deliveryLocation
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order #{order._id?.slice(-6)}</h1>

      {showMap && (
        <div className="mb-6">
          <OrderMap
            restaurant={order.restaurantId}
            deliveryAddress={order.deliveryAddress}
            deliveryLocation={order.deliveryLocation}
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold mb-4">{order.restaurantId?.name}</h2>
        <div className="space-y-2">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      {!isCancelled && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold mb-4">Order Status</h3>
          <div className="flex justify-between">
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= stepIndex ? "bg-promart-orange text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className="text-xs mt-1 text-center hidden sm:block">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">Order cancelled</div>
      )}
    </div>
  );
}
