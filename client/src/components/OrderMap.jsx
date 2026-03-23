import { useEffect, useRef, useState } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function OrderMap({ restaurant, deliveryAddress, deliveryLocation }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError("Add VITE_GOOGLE_MAPS_API_KEY to enable live tracking");
      return;
    }

    const loadScript = () =>
      new Promise((resolve, reject) => {
        if (window.google?.maps) return resolve();
        const el = document.createElement("script");
        el.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        el.async = true;
        el.onload = resolve;
        el.onerror = () => reject(new Error("Failed to load Google Maps"));
        document.head.appendChild(el);
      });

    let center = { lat: 19.076, lng: 72.8777 };
    const hasRestaurant = restaurant?.location?.lat && restaurant?.location?.lng;
    const hasDelivery = deliveryAddress?.lat && deliveryAddress?.lng;
    const hasDriver = deliveryLocation?.lat && deliveryLocation?.lng;

    if (hasRestaurant) center = { lat: restaurant.location.lat, lng: restaurant.location.lng };
    else if (hasDelivery) center = { lat: deliveryAddress.lat, lng: deliveryAddress.lng };
    else if (hasDriver) center = { lat: deliveryLocation.lat, lng: deliveryLocation.lng };

    loadScript()
      .then(() => {
        if (!mapRef.current) return;
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
        });
        mapInstanceRef.current = map;

        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        const addMarker = (pos, label, color) => {
          const marker = new window.google.maps.Marker({
            position: pos,
            map,
            label: label || "",
            icon: color
              ? {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 12,
                  fillColor: color,
                  fillOpacity: 1,
                  strokeColor: "#fff",
                  strokeWeight: 2,
                }
              : undefined,
          });
          markersRef.current.push(marker);
          return marker;
        };

        if (hasRestaurant) addMarker(restaurant.location, "R", "#E23744");
        if (hasDelivery) addMarker({ lat: deliveryAddress.lat, lng: deliveryAddress.lng }, "D", "#22c55e");
        if (hasDriver) addMarker(deliveryLocation, "🚗", "#3b82f6");

        const bounds = new window.google.maps.LatLngBounds();
        if (hasRestaurant) bounds.extend(restaurant.location);
        if (hasDelivery) bounds.extend({ lat: deliveryAddress.lat, lng: deliveryAddress.lng });
        if (hasDriver) bounds.extend(deliveryLocation);
        if (!bounds.isEmpty()) map.fitBounds(bounds, 60);
      })
      .catch((err) => setError(err.message));

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
    };
  }, [restaurant, deliveryAddress, deliveryLocation]);

  if (error) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-600">
        <p className="mb-2">📍 Live tracking</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <div ref={mapRef} className="w-full h-64 bg-gray-200" />
      <div className="bg-white px-4 py-2 flex gap-4 text-xs text-gray-600">
        {restaurant?.location && <span><span className="inline-block w-2 h-2 rounded-full bg-promart-red mr-1" /> Restaurant</span>}
        {deliveryAddress?.lat && <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" /> Delivery</span>}
        {deliveryLocation && <span><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" /> Driver</span>}
      </div>
    </div>
  );
}
