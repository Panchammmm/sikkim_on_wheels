import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState, useRef } from "react";
import { Navigation } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = { lat: 27.2, lng: 88.3 };

// Route stops
const ROUTE_STOPS = [
  { name: "New Jalpaiguri", lat: 26.68622, lng: 88.442233 },
  { name: "Rinchenpong", lat: 27.1833, lng: 88.2667 },
  { name: "Namchi", lat: 27.303, lng: 88.378 },
  { name: "Pelling", lat: 27.299, lng: 88.234 },
  { name: "Ravangla", lat: 27.307, lng: 88.363 },
  { name: "NJP End", lat: 26.685644, lng: 88.44352 },
];

export default function SightseeingMap() {
  const sectionRef = useRef(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const lastUpdate = useRef(0);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const [userPos, setUserPos] =
    useState<google.maps.LatLngLiteral | null>(null);

  const [gpsError, setGpsError] = useState(false);

  // 📍 Live GPS tracking (throttled)
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError(true);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();

        // throttle updates (every 2s)
        if (now - lastUpdate.current > 2000) {
          lastUpdate.current = now;

          setUserPos({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        }
      },
      (err) => {
        console.error("GPS error:", err);
        setGpsError(true);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 🗺 Fetch route
  useEffect(() => {
    if (!isLoaded || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: ROUTE_STOPS[0].lat, lng: ROUTE_STOPS[0].lng },
        destination: { lat: ROUTE_STOPS[ROUTE_STOPS.length - 1].lat, lng: ROUTE_STOPS[ROUTE_STOPS.length - 1].lng },
        waypoints: ROUTE_STOPS.slice(1, -1).map((s) => ({
          location: { lat: s.lat, lng: s.lng },
          stopover: true,
        })),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [isLoaded]);

  // 📍 Auto-center on user
  useEffect(() => {
    if (userPos && mapRef.current) {
      mapRef.current.panTo(userPos);
    }
  }, [userPos]);

  const bikeIcon = useMemo(() => {
    if (!isLoaded || !window.google) return undefined;

    return {
      url: "https://toppng.com/uploads/preview/dirt-bike-silhouette-icons-png-dirt-bike-11562896562ygln9b2atx.png",
      scaledSize: new window.google.maps.Size(40, 40),
    };
  }, [isLoaded]);

  // 🎞 Parallax scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yHeading = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yText = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const yMap = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scaleMap = useTransform(scrollYProgress, [0, 1], [0.95, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  if (!isLoaded) {
    return <p className="text-center mt-10">Loading map...</p>;
  }

  return (
    <section
      ref={sectionRef}
      id="map"
      className="section-padding bg-background overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <motion.h2
          style={{ y: yHeading, opacity }}
          className="text-center font-display text-4xl tracking-wider text-foreground sm:text-5xl"
        >
          Explore the{" "}
          <span className="text-gradient-sunset">Ride Route</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          style={{ y: yText, opacity }}
          className="mx-auto mt-4 max-w-xl text-center font-body text-muted-foreground"
        >
          Follow your journey across Sikkim with live GPS tracking and real road routes.
        </motion.p>

        {/* Map */}
        <motion.div
          style={{ y: yMap, scale: scaleMap }}
          className="mt-12 overflow-hidden rounded-2xl border shadow-lg"
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={8}
            onLoad={(map) => { (mapRef.current = map) }}
          >
            {/* Route */}
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
              <Marker
                key={i}
                position={s}
                label={{
                  text: `${i + 1}`,
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
            ))}

            {/* Live bike */}
            {userPos && bikeIcon && (
              <Marker position={userPos} icon={bikeIcon} />
            )}
          </GoogleMap>
        </motion.div>

        {/* Footer */}
        <motion.div
          style={{ opacity }}
          className="mt-3 text-center text-xs text-muted-foreground"
        >
          <div className="flex items-center justify-center gap-1">
            <Navigation className="h-3 w-3" />
            {gpsError ? "Location access denied" : "Live GPS tracking enabled"}
          </div>
        </motion.div>

      </div>
    </section>
  );
}