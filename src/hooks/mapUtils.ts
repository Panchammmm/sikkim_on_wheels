// mapUtils.ts
import { DayStop, LatLng } from "../data/tripData";

// Decode polyline
export function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b: number, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}

// Routes API
export async function fetchRoadRoute(
  stops: DayStop[],
  apiKey: string,
  signal: AbortSignal
): Promise<LatLng[] | null> {
  if (stops.length < 2) return null;

  const body = {
    origin: {
      location: { latLng: { latitude: stops[0].lat, longitude: stops[0].lng } },
    },
    destination: {
      location: {
        latLng: {
          latitude: stops[stops.length - 1].lat,
          longitude: stops[stops.length - 1].lng,
        },
      },
    },
    intermediates: stops.slice(1, -1).map((s) => ({
      location: { latLng: { latitude: s.lat, longitude: s.lng } },
    })),
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_UNAWARE",
    polylineQuality: "HIGH_QUALITY",
  };

  try {
    const res = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const encoded = data?.routes?.[0]?.polyline?.encodedPolyline;

    return encoded ? decodePolyline(encoded) : null;
  } catch (err) {
    if ((err as Error).name === "AbortError") return null;
    return null;
  }
}

// Draw polylines
export function drawRoutePolylines(
  map: google.maps.Map,
  path: LatLng[],
  color: string
) {
  const { google } = window;

  const border = new google.maps.Polyline({
    path,
    geodesic: true,
    strokeColor: "#ffffff",
    strokeOpacity: 1,
    strokeWeight: 9,
    zIndex: 1,
    map,
  });

  const route = new google.maps.Polyline({
    path,
    geodesic: true,
    strokeColor: color,
    strokeOpacity: 1,
    strokeWeight: 5,
    zIndex: 2,
    map,
  });

  return [border, route];
}