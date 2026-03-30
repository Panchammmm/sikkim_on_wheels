import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Navigation, AlertCircle } from "lucide-react";
import "leaflet/dist/leaflet.css";

// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const SPOT_ICON = new L.DivIcon({
  className: "",
  html: `<div style="background:hsl(24,85%,55%);width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">📍</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const USER_ICON = new L.DivIcon({
  className: "",
  html: `<div style="background:hsl(210,90%,55%);width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3),0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const ROUTE_ICON = (num: number) =>
  new L.DivIcon({
    className: "",
    html: `<div style="background:hsl(145,40%,38%);width:30px;height:30px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:13px;font-family:sans-serif;">${num}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

interface Spot {
  name: string;
  lat: number;
  lon: number;
  description: string;
  day: number;
  type: "sightseeing" | "route";
}

const SPOTS: Spot[] = [
  { name: "Siliguri (Start)", lat: 26.7271, lon: 88.3953, description: "Journey starts here — gateway to Northeast India", day: 1, type: "route" },
  { name: "Jorethang Market", lat: 27.0960, lon: 88.3210, description: "Local momos & thukpa stop along Teesta River", day: 1, type: "sightseeing" },
  { name: "Rinchenpong", lat: 27.1833, lon: 88.2667, description: "Night halt — stunning sunrise over Kanchenjunga", day: 1, type: "route" },
  { name: "Pemayangtse Monastery", lat: 27.3030, lon: 88.2340, description: "One of the oldest monasteries in Sikkim", day: 2, type: "sightseeing" },
  { name: "Rabdentse Ruins", lat: 27.3020, lon: 88.2290, description: "Remnants of the ancient capital of Sikkim", day: 2, type: "sightseeing" },
  { name: "Pelling Skywalk", lat: 27.2980, lon: 88.2360, description: "Glass-floor skywalk with valley views", day: 2, type: "sightseeing" },
  { name: "Pelling", lat: 27.2990, lon: 88.2340, description: "Night halt — views of Kanchenjunga range", day: 2, type: "route" },
  { name: "Khecheopalri Lake", lat: 27.3400, lon: 88.2060, description: "Sacred wishing lake surrounded by prayer flags", day: 3, type: "sightseeing" },
  { name: "Dubdi Monastery", lat: 27.3710, lon: 88.2200, description: "Oldest monastery in Sikkim — forest trek", day: 3, type: "sightseeing" },
  { name: "Yuksom", lat: 27.3690, lon: 88.2210, description: "Night halt — coronation throne of first Chogyal", day: 3, type: "route" },
  { name: "Tashiding Monastery", lat: 27.3150, lon: 88.2850, description: "Holiest monastery in Sikkim", day: 4, type: "sightseeing" },
  { name: "Buddha Park Ravangla", lat: 27.3060, lon: 88.3620, description: "130-foot Buddha statue with landscaped gardens", day: 4, type: "sightseeing" },
  { name: "Temi Tea Garden", lat: 27.2530, lon: 88.3950, description: "Only tea garden in Sikkim with Himalayan views", day: 4, type: "sightseeing" },
  { name: "Ravangla", lat: 27.3070, lon: 88.3630, description: "Night halt — tea gardens and Maenam Hill", day: 4, type: "route" },
  { name: "Namchi Char Dham", lat: 27.1670, lon: 88.3650, description: "Samdruptse viewpoint — giant Guru Padmasambhava statue", day: 5, type: "sightseeing" },
  { name: "Siliguri (End)", lat: 26.7271, lon: 88.3953, description: "Journey ends — back to the plains", day: 5, type: "route" },
];

const ROUTE_STOPS = SPOTS.filter((s) => s.type === "route");
const ROUTE_LINE: [number, number][] = ROUTE_STOPS.map((s) => [s.lat, s.lon]);

function FitBounds({ userPos }: { userPos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    const pts: [number, number][] = SPOTS.map((s) => [s.lat, s.lon]);
    if (userPos) pts.push(userPos);
    if (pts.length > 0) {
      map.fitBounds(L.latLngBounds(pts).pad(0.1));
    }
  }, [map, userPos]);
  return null;
}

export default function SightseeingMap() {
  const { ref, isVisible } = useScrollAnimation();
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | number>("all");
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported");
      return;
    }
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => setGeoError("Location access denied — showing route only"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  const filteredSpots = filter === "all" ? SPOTS : SPOTS.filter((s) => s.day === filter);

  return (
    <section id="map" className="section-padding bg-background">
      <div ref={ref} className="mx-auto max-w-5xl">
        <h2
          className={`font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          Explore the <span className="text-gradient-sunset">Route</span>
        </h2>
        <p
          className={`mx-auto mt-3 max-w-lg text-center font-body text-sm text-muted-foreground ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          Interactive map with all sightseeing spots and your live location.
        </p>

        {geoError && (
          <div className="mx-auto mt-4 flex max-w-md items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-body text-xs text-muted-foreground">{geoError}</span>
          </div>
        )}

        {/* Day filter */}
        <div
          className={`mt-6 flex flex-wrap items-center justify-center gap-2 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          {["all", 1, 2, 3, 4, 5].map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d as "all" | number)}
              className={`rounded-full px-4 py-1.5 font-body text-xs font-medium transition-colors ${
                filter === d
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {d === "all" ? "All Days" : `Day ${d}`}
            </button>
          ))}
        </div>

        {/* Map */}
        <div
          className={`mt-6 overflow-hidden rounded-2xl border border-border shadow-lg ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.3s", height: "480px" }}
        >
          <MapContainer
            center={[27.2, 88.3]}
            zoom={10}
            className="h-full w-full z-0"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds userPos={userPos} />

            {/* Route polyline */}
            <Polyline positions={ROUTE_LINE} color="hsl(145,40%,38%)" weight={3} opacity={0.6} dashArray="8 6" />

            {/* Spots */}
            {filteredSpots.map((spot) => (
              <Marker
                key={spot.name + spot.day}
                position={[spot.lat, spot.lon]}
                icon={spot.type === "route" ? ROUTE_ICON(spot.day) : SPOT_ICON}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <p className="font-semibold text-sm">{spot.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{spot.description}</p>
                    <span className="inline-block mt-2 text-[10px] font-medium bg-green-100 text-green-800 rounded-full px-2 py-0.5">
                      Day {spot.day}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* User location */}
            {userPos && (
              <Marker position={userPos} icon={USER_ICON}>
                <Popup>
                  <div className="flex items-center gap-1.5">
                    <Navigation className="h-3 w-3 text-blue-500" />
                    <span className="font-semibold text-sm">You are here</span>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 font-body text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-accent" /> Route Stop
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-primary" /> Sightseeing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: "hsl(210,90%,55%)" }} /> Your Location
          </span>
        </div>
      </div>
    </section>
  );
}
