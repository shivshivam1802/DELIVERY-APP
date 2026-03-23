self.addEventListener("push", (e) => {
  const data = e.data?.json() || { title: "Promart", body: "New notification" };
  e.waitUntil(
    self.registration.showNotification(data.title || "Promart", {
      body: data.body,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const c of clientList) {
        if (c.url.includes("/orders") && "focus" in c) return c.focus();
      }
      if (clients.openWindow) clients.openWindow("/orders");
    })
  );
});
