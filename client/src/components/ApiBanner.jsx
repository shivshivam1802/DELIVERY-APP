import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ApiBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    api.get("/restaurants").then(() => setShow(false)).catch(() => setShow(true));
  }, []);

  if (!show) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
      <span className="font-medium">API not connected.</span>{" "}
      Deploy the backend to see restaurants and place orders.{" "}
      <a href="https://github.com/shivshivam1802/DELIVERY-APP" className="underline">View README</a>
    </div>
  );
}
