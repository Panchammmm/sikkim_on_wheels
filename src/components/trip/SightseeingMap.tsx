import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Navigation } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = { lat: 27.2, lng: 88.3 };

// Route stops
const ROUTE_STOPS = [
  { name: "New Jalpaiguri", lat: 26.686220, lng: 88.442233 },
  { name: "Rinchenpong", lat: 27.1833, lng: 88.2667 },
  { name: "Pelling", lat: 27.299, lng: 88.234 },
  { name: "Yuksom", lat: 27.369, lng: 88.221 },
  { name: "Ravangla", lat: 27.307, lng: 88.363 },
  { name: "NJP End", lat: 26.685644, lng: 88.443520 },
];

export default function SightseeingMap() {
  const { ref, isVisible } = useScrollAnimation();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const [userPos, setUserPos] =
    useState<google.maps.LatLngLiteral | null>(null);

  // 📍 Live GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => { },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Fetch route ONLY after map loads
  useEffect(() => {
    if (!isLoaded || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: ROUTE_STOPS[0],
        destination: ROUTE_STOPS[ROUTE_STOPS.length - 1],
        waypoints: ROUTE_STOPS.slice(1, -1).map((s) => ({
          location: s,
          stopover: true,
        })),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  }, [isLoaded]);

  // Bike icon
  const bikeIcon = useMemo(() => {
    if (!isLoaded || !window.google) return undefined;

    return {
      url: "https://toppng.com/uploads/preview/dirt-bike-silhouette-icons-png-dirt-bike-11562896562ygln9b2atx.png",
      scaledSize: new window.google.maps.Size(40, 40),
    };
  }, [isLoaded]);

  // ⛔ Prevent crash
  if (!isLoaded) {
    return <p className="text-center mt-10">Loading map...</p>;
  }

  return (
    <section id="map" className="relative section-padding bg-background overflow-hidden">
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="relative mx-auto max-w-6xl text-center">

          {/* background */}
          <div className="absolute blur-3xl opacity-30" />

          <h2
            className={`font-display text-4xl sm:text-5xl tracking-wider text-foreground ${isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
          >
            Explore the{" "}
            <span className="text-gradient-sunset">
              Ride Route
            </span>
          </h2>

          <p
            className={`mx-auto mt-3 max-w-xl text-sm text-muted-foreground ${isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
            style={{ animationDelay: "0.1s" }}
          >
            Follow your journey across Sikkim with live GPS tracking and real road routes.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border shadow-lg">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={8}
          >
            {/* Road Route */}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: "#f97316",
                    strokeWeight: 5,
                  },
                }}
              />
            )}

            {/* Stops */}
            {ROUTE_STOPS.map((s, i) => (
              <Marker key={i} position={s} label={`${i + 1}`} />
            ))}

            {/* Live Bike */}
            {userPos && bikeIcon && (
              <Marker position={userPos} icon={bikeIcon} />
            )}
          </GoogleMap>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Navigation className="h-3 w-3" />
          Live GPS tracking enabled
        </p>
      </div>
    </section>
  );
}