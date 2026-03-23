import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import PushNotificationPrompt from "./PushNotificationPrompt";
import ApiBanner from "./ApiBanner";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <ApiBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PushNotificationPrompt user={user} />
      <footer className="bg-promart-dark text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-2xl font-bold text-promart-red mb-2">Promart</p>
          <p className="text-gray-400 text-sm">Order food from the best restaurants. © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
