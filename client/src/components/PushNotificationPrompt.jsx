import { useState } from "react";
import { usePushNotifications } from "../hooks/usePushNotifications";

export default function PushNotificationPrompt({ user }) {
  const { supported, subscribed, subscribe } = usePushNotifications(!!user);
  const [dismissed, setDismissed] = useState(() =>
    localStorage.getItem("pushPromptDismissed") === "true"
  );
  const [loading, setLoading] = useState(false);

  if (!user || !supported || subscribed || dismissed) return null;

  const handleEnable = async () => {
    setLoading(true);
    const ok = await subscribe();
    setLoading(false);
    if (ok) setDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-white rounded-xl shadow-lg border p-4 z-50 flex items-start gap-3">
      <span className="text-2xl">🔔</span>
      <div className="flex-1">
        <p className="font-semibold text-sm">Get order updates</p>
        <p className="text-xs text-gray-500 mt-0.5">Enable notifications for order status updates</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            localStorage.setItem("pushPromptDismissed", "true");
            setDismissed(true);
          }}
          className="text-gray-500 text-sm"
        >
          Later
        </button>
        <button
          onClick={handleEnable}
          disabled={loading}
          className="bg-promart-red text-white text-sm px-3 py-1.5 rounded-lg disabled:opacity-50"
        >
          {loading ? "..." : "Enable"}
        </button>
      </div>
    </div>
  );
}
