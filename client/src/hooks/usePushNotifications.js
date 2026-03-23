import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

export function usePushNotifications(enabled) {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setSupported("serviceWorker" in navigator && "PushManager" in window);
  }, []);

  const subscribe = useCallback(async () => {
    if (!enabled || !supported) return false;
    try {
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      await reg.update();
      const { data } = await api.get("/notifications/vapid-public");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });
      await api.post("/notifications/subscribe", sub);
      setSubscribed(true);
      return true;
    } catch (err) {
      console.warn("Push subscription failed:", err);
      return false;
    }
  }, [enabled, supported]);

  useEffect(() => {
    if (enabled && supported) {
      navigator.serviceWorker.ready.then(() => subscribe());
    }
  }, [enabled, supported, subscribe]);

  return { supported, subscribed, subscribe };
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}
