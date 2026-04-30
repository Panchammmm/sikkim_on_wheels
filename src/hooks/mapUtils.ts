import { itinerary } from "@/data/tripData";
import type { DayMeta, DayStop, LatLng } from "@/data/types";

// Per-day map config
export const DAY_META_MAP: Record<number, DayMeta> = {
  1: {
    color: "#E85D26",
    stops: [
      { lat: 26.685, lng: 88.444, label: "NJP Station" },
      { lat: 27.131, lng: 88.283, label: "Jorethang" },
      { lat: 27.279, lng: 88.275, label: "Legship" },
      { lat: 27.241, lng: 88.270, label: "Rinchenpong" },
    ],
  },
  2: {
    color: "#3B82F6",
    stops: [
      { lat: 27.241, lng: 88.270, label: "Rinchenpong" },
      { lat: 27.279, lng: 88.275, label: "Legship" },
      { lat: 27.303, lng: 88.252, label: "Rabdentse Ruins" },
      { lat: 27.304, lng: 88.249, label: "Pemayangtse Monastery" },
      { lat: 27.301, lng: 88.237, label: "Pelling City" },
    ],
  },
  3: {
    color: "#10B981",
    stops: [
      { lat: 27.301, lng: 88.237, label: "Pelling City" },
      { lat: 27.297, lng: 88.223, label: "Skywalk" },
      { lat: 27.315, lng: 88.189, label: "Rimbi" },
      { lat: 27.301, lng: 88.237, label: "Pelling City" },
    ],
  },
  4: {
    color: "#8B5CF6",
    stops: [
      { lat: 27.301, lng: 88.237, label: "Pelling City" },
      { lat: 27.302, lng: 88.366, label: "Ravangla" },
      { lat: 27.257, lng: 88.395, label: "Temi Tea Garden" },
      { lat: 27.166, lng: 88.362, label: "Namchi" },
    ],
  },
  5: {
    color: "#F59E0B",
    stops: [
      { lat: 27.166, lng: 88.362, label: "Namchi" },
      { lat: 26.685, lng: 88.444, label: "NJP Station" },
    ],
  },
};

// getDayMeta
export function getDayMeta(dayIndex: number): DayMeta {
  const day = itinerary[dayIndex];
  return DAY_META_MAP[day.day] ?? { color: "#888", stops: [] };
}

// ── loadGoogleMapsScript
// Injects the Maps JS API script tag once and fires `onReady` via the global
// initMap callback. window.initMap is always reassigned before the early-return
// guard so that component remounts (unmount → remount while script is still
// loading) still receive the callback on the live instance.
// Returns a cleanup fn that neutralises the global reference on unmount.
export function loadGoogleMapsScript(apiKey: string, onReady: () => void): () => void {
  if (window.google?.maps?.Map) {
    onReady();
    return () => { };
  }

  const scriptId = "gmap-script";
  window.initMap = onReady; // reassign before early-return for remount safety

  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=marker,geometry&loading=async`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  return () => { window.initMap = () => { }; };
}

// ── decodePolyline
// Converts the encoded polyline string returned by the Routes API into LatLng[].
export function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b: number, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

// ── fetchRoadRoute
// Calls the Routes API and returns a road-snapped LatLng path, or null on
// failure / abort.
// NOTE: The API key is used client-side — restrict it by HTTP referrer in
// Google Cloud Console to prevent unauthorised use.
export async function fetchRoadRoute(
  stops: DayStop[],
  apiKey: string,
  signal: AbortSignal
): Promise<LatLng[] | null> {
  if (stops.length < 2) return null;

  const body = {
    origin: { location: { latLng: { latitude: stops[0].lat, longitude: stops[0].lng } } },
    destination: { location: { latLng: { latitude: stops[stops.length - 1].lat, longitude: stops[stops.length - 1].lng } } },
    intermediates: stops.slice(1, -1).map((s) => ({ location: { latLng: { latitude: s.lat, longitude: s.lng } } })),
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_UNAWARE",
    polylineQuality: "HIGH_QUALITY",
  };

  try {
    const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) { console.warn("Routes API error:", res.status, await res.text()); return null; }
    const data = await res.json();
    const encoded = data?.routes?.[0]?.polyline?.encodedPolyline;
    if (!encoded) { console.warn("Routes API: no polyline", data); return null; }
    return decodePolyline(encoded);
  } catch (err) {
    if ((err as Error).name === "AbortError") return null;
    console.warn("Routes API fetch error:", err);
    return null;
  }
}

// ── drawRoutePolylines
// Draws a two-layer polyline: a white border underneath + a coloured stroke on
// top, matching the native Google Maps route appearance.
export function drawRoutePolylines(
  map: google.maps.Map,
  path: LatLng[],
  color: string
): google.maps.Polyline[] {
  const border = new window.google.maps.Polyline({ path, geodesic: true, strokeColor: "#ffffff", strokeOpacity: 1, strokeWeight: 9, zIndex: 1, map });
  const route = new window.google.maps.Polyline({ path, geodesic: true, strokeColor: color, strokeOpacity: 1, strokeWeight: 5, zIndex: 2, map });
  return [border, route];
}