import React, { useEffect, useRef, useState, useCallback } from "react";
import { DayItinerary, itinerary, DayStop, DayMeta, LatLng } from "../../data/tripData";

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

// Per-day config  
const DAY_META_MAP: Record<number, DayMeta> = {
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

function getDayMeta(dayIndex: number): DayMeta {
  const day = itinerary[dayIndex];
  return DAY_META_MAP[day.day] ?? { color: "#888", stops: [] };
}

// Difficulty config 
const DIFFICULTY_CONFIG: Record<
  DayItinerary["difficulty"],
  { label: string; color: string }
> = {
  easy:        { label: "Easy",        color: "#10B981" },
  moderate:    { label: "Moderate",    color: "#F59E0B" },
  challenging: { label: "Challenging", color: "#EF4444" },
};

// Decode Google's encoded polyline
function decodePolyline(encoded: string): LatLng[] {
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

// Routes API fetch
async function fetchRoadRoute(
  stops: DayStop[],
  apiKey: string,
  signal: AbortSignal
): Promise<LatLng[] | null> {
  if (stops.length < 2) return null;

  const body = {
    origin:        { location: { latLng: { latitude: stops[0].lat,                longitude: stops[0].lng } } },
    destination:   { location: { latLng: { latitude: stops[stops.length - 1].lat, longitude: stops[stops.length - 1].lng } } },
    intermediates: stops.slice(1, -1).map((s) => ({ location: { latLng: { latitude: s.lat, longitude: s.lng } } })),
    travelMode:        "DRIVE",
    routingPreference: "TRAFFIC_UNAWARE",
    polylineQuality:   "HIGH_QUALITY",
  };

  try {
    const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      signal,
      headers: {
        "Content-Type":    "application/json",
        "X-Goog-Api-Key":  apiKey,
        "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) { console.warn("Routes API error:", res.status, await res.text()); return null; }
    const data    = await res.json();
    const encoded = data?.routes?.[0]?.polyline?.encodedPolyline;
    if (!encoded) { console.warn("Routes API: no polyline", data); return null; }
    return decodePolyline(encoded);
  } catch (err) {
    if ((err as Error).name === "AbortError") return null;
    console.warn("Routes API fetch error:", err);
    return null;
  }
}

// Draw two-layer polyline (white border + colour stroke) upon google map route API fetching fallback
function drawRoutePolylines(map: google.maps.Map, path: LatLng[], color: string): google.maps.Polyline[] {
  const { google } = window;
  const border = new google.maps.Polyline({ path, geodesic: true, strokeColor: "#ffffff", strokeOpacity: 1, strokeWeight: 9, zIndex: 1, map });
  const route  = new google.maps.Polyline({ path, geodesic: true, strokeColor: color,    strokeOpacity: 1, strokeWeight: 5, zIndex: 2, map });
  return [border, route];
}

// Day Tabs sub-components
const DayTab: React.FC<{
  day: DayItinerary; index: number; active: boolean; onClick: () => void;
}> = ({ day, index, active, onClick }) => {
  const meta = getDayMeta(index);
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className="rounded-full px-4 py-2 text-[13px] font-bold tracking-wide whitespace-nowrap transition-all duration-200 border-2"
      style={{
        borderColor: active ? meta.color : "transparent",
        background:  active ? meta.color : "rgba(255,255,255,0.07)",
        color:       active ? "#fff"     : "rgba(255,255,255,0.55)",
      }}
    >
      Day {day.day}
    </button>
  );
};

const StatPill: React.FC<{ icon: string; value: string; label: string }> = ({ icon, value, label }) => (
  <div className="flex flex-col items-center gap-0.5 bg-white/[0.06] rounded-xl px-3.5 py-2.5 min-w-[72px]">
    <span className="text-lg" aria-hidden="true">{icon}</span>
    <span className="text-white font-bold text-[13px]">{value}</span>
    <span className="text-white/40 text-[10px] uppercase tracking-widest">{label}</span>
  </div>
);

const Section: React.FC<{ title: string; icon: string; color: string; children: React.ReactNode }> = ({ title, icon, color, children }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-[15px]" aria-hidden="true">{icon}</span>
      <span className="text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color }}>{title}</span>
    </div>
    <div className="pl-3.5 flex flex-col gap-1.5 border-l-2" style={{ borderColor: `${color}40` }}>
      {children}
    </div>
  </div>
);

const ListItem: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-white/75 text-[13px] leading-relaxed m-0">{text}</p>
);

// ── Main Component ────────────
const TripMap: React.FC = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  // Overlay tracking
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);  // track listener handles for removal

  // (route cache): in-memory cache keyed by day index.
  // Stores the decoded LatLng path, or the sentinel "fallback" for failed fetches.
  // Eliminates repeated paid API calls when the user revisits a day tab.
  const routeCacheRef = useRef<Record<number, LatLng[] | "fallback">>({});

  const abortControllerRef = useRef<AbortController | null>(null);
  const mapJustInitRef     = useRef(false); // prevents double-render on init

  const [activeDay,    setActiveDay]    = useState(0);
  const [mapLoaded,    setMapLoaded]    = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [activeTab,    setActiveTab]    = useState<"highlights" | "food" | "tips">("highlights");

  const day              = itinerary[activeDay];
  const meta             = getDayMeta(activeDay);
  const difficultyConfig = DIFFICULTY_CONFIG[day.difficulty];

  // Load Google Maps script 
  useEffect(() => {
    // check window.google?.maps, not just window.google — ensures the
    // Maps core library is initialised, not just the outer namespace object.
    if (window.google && window.google.maps && window.google.maps.Map) {
      setMapLoaded(true);
      return;
    }

    const scriptId = "gmap-script";

    // Reassign initMap before the early-return so remounts still fire the callback
    window.initMap = () => setMapLoaded(true);

    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id    = scriptId;
    script.src   = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap&libraries=marker,geometry&loading=async`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => { window.initMap = () => {}; };
  }, [googleMapsApiKey]);

  // Clear all overlays: markers, polylines, infowindows, listeners 
  const clearOverlays = useCallback(() => {
    // close open InfoWindows before detaching markers
    infoWindowsRef.current.forEach((iw) => iw.close());
    infoWindowsRef.current = [];

    // remove all Google Maps event listener handles
    listenersRef.current.forEach((handle) =>
      window.google?.maps.event.removeListener(handle)
    );
    listenersRef.current = [];

    markersRef.current.forEach((m) => { m.map = null; });
    markersRef.current = [];

    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
  }, []);

  // Place pins on locations on map
  const placeMarkers = useCallback((map: google.maps.Map, m: DayMeta, dayIdx: number) => {
    // Destructure from the already-loaded library (importLibrary called in renderDay)
    const { AdvancedMarkerElement } = window.google.maps.marker;
    const d = itinerary[dayIdx];

    m.stops.forEach((stop, i) => {
      const pin = document.createElement("div");
      pin.innerHTML = `
        <div style="width:32px;height:40px;position:relative;cursor:pointer;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 36 44">
            <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.06 27.94 0 18 0z"
              fill="${m.color}" stroke="white" stroke-width="1.5"/>
            <circle cx="18" cy="18" r="10" fill="white" opacity="0.97"/>
            <text x="18" y="22" text-anchor="middle" font-size="10"
              font-weight="700" fill="${m.color}" font-family="monospace">${i + 1}</text>
          </svg>
        </div>`;

      const pinEl = pin.querySelector("div");
      if (!pinEl) return;

      const marker = new AdvancedMarkerElement({
        position: { lat: stop.lat, lng: stop.lng },
        map,
        title:   stop.label,
        content: pinEl,
        zIndex:  10,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;font-size:13px;color:#111;padding:6px 8px;line-height:1.6;min-width:130px">
          <strong style="font-size:14px">${stop.label}</strong><br/>
          <span style="color:#777;font-size:11px">Stop ${i + 1} of ${m.stops.length} &middot; Day ${d.day}</span>
        </div>`,
      });

      // store the handle returned by addListener so it can be removed later
      const handle = marker.addListener("gmp-click", () => { infoWindow.open({map, anchor: marker}); });

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
      listenersRef.current.push(handle);
    });
  }, []);

  // Render a day's route: fetch from API if not cached, then draw route and markers
  const renderDay = useCallback(
    async (dayIndex: number) => {
      if (!mapInstanceRef.current || !window.google?.maps) return;

      // FIX 2: importLibrary("marker") is idempotent and guarantees the library
      // is fully initialised before we touch AdvancedMarkerElement — even if the
      // libraries=marker param in the script URL loads it async.
      await window.google.maps.importLibrary("marker");

      // Guard after await: component may have unmounted during the library load
      if (!mapInstanceRef.current) return;

      // Abort any in-flight fetch from a previous renderDay call
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const map = mapInstanceRef.current;
      const m   = getDayMeta(dayIndex);

      // FIX 1 (route cache): serve from memory if we've fetched this day before.
      // This means zero additional API calls after the first visit to each day tab.
      const cached = routeCacheRef.current[dayIndex];
      if (cached !== undefined) {
        clearOverlays();
        const path = cached === "fallback"
          ? m.stops.map((s) => ({ lat: s.lat, lng: s.lng }))
          : cached;
        polylinesRef.current = drawRoutePolylines(map, path, m.color);
        placeMarkers(map, m, dayIndex);
        // Single fitBounds — no double-snap (FIX: double fitBounds)
        const bounds = new window.google.maps.LatLngBounds();
        path.forEach((p) => bounds.extend(p));
        map.fitBounds(bounds, { top: 60, right: 40, bottom: 60, left: 40 });
        return;
      }

      // Cache miss: fetch from Routes API.
      // We do NOT clear overlays yet — the previous day's route stays visible
      // during the fetch, avoiding the empty-map flicker.
      setRouteLoading(true);

      const roadPath = await fetchRoadRoute(m.stops, googleMapsApiKey, controller.signal);

      // Bail if this render was superseded (user switched day mid-fetch)
      if (controller.signal.aborted) return;

      setRouteLoading(false);

      // cache the result. "fallback" sentinel = fetch failed, use straight lines.
      routeCacheRef.current[dayIndex] = roadPath ?? "fallback";

      // Now safe to clear — we have the new path ready to draw immediately
      clearOverlays();

      const drawPath = roadPath ?? m.stops.map((s) => ({ lat: s.lat, lng: s.lng }));
      polylinesRef.current = drawRoutePolylines(map, drawPath, m.color);
      placeMarkers(map, m, dayIndex);

      // (double fitBounds): single conditional — use road bounds if available,
      // otherwise stop bounds. No second fitBounds call, no visible snap.
      const boundsPath = roadPath ?? m.stops.map((s) => ({ lat: s.lat, lng: s.lng }));
      const bounds = new window.google.maps.LatLngBounds();
      boundsPath.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, { top: 60, right: 40, bottom: 60, left: 40 });
    },
    [clearOverlays, placeMarkers, googleMapsApiKey]
  );

  // ── Init map once on load
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    // (mapId + styles): mapId and styles[] are mutually exclusive in the Maps configuration. MapId is used to leverage Cloud Console styling, which also gives us access to the advanced vector basemap and future style updates without code changes.
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      mapTypeId:         "roadmap",
      zoom:              9,
      center:            { lat: 27.1, lng: 88.3 },
      zoomControl:       true,
      mapTypeControl:    false,
      streetViewControl: false,
      fullscreenControl: true,

      mapId: import.meta.env.VITE_GOOGLE_MAP_ID ?? "DEMO_MAP_ID",
    });

    mapJustInitRef.current = true;
    renderDay(0);
  }, [mapLoaded, renderDay]);

  // Re-render on day change
  useEffect(() => {
    // Skip the first trigger from mapLoaded flipping — init effect already called renderDay(0)
    if (mapJustInitRef.current) { mapJustInitRef.current = false; return; }
    if (mapLoaded && mapInstanceRef.current) {
      renderDay(activeDay);
      setActiveTab((prev) => (prev === "highlights" ? prev : "highlights"));
    }
  }, [activeDay, mapLoaded, renderDay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      clearOverlays();
      mapInstanceRef.current = null;
    };
  }, [clearOverlays]);

  // Render 
  return (
    <section id="trip-map" className="py-16">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-center font-display text-4xl tracking-wider text-foreground sm:text-5xl">
            Explore the{" "}
            <span className="text-gradient-sunset">Ride Route</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center font-body text-muted-foreground">
            Follow your journey across Sikkim with live GPS tracking and real road routes.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0d1117] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/[0.06]">

          {/* ── Header ── */}
          <div
            className="border-b border-white/[0.08] px-6 pt-5 pb-4"
            style={{ background: `linear-gradient(135deg, ${meta.color}22 0%, transparent 60%)` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0"
                style={{ background: meta.color }}
                aria-hidden="true"
              >
                D{day.day}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base tracking-wide m-0">{day.from} → {day.to}</p>
                <p className="text-white/40 text-xs mt-0.5 m-0">{day.route}</p>
              </div>

              {routeLoading && (
                <div className="flex items-center gap-2 text-white/40 text-xs" role="status" aria-live="polite" aria-label="Finding road route">
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin shrink-0"
                    style={{ borderColor: `${meta.color} transparent transparent transparent` }}
                    aria-hidden="true"
                  />
                  <span>Finding road…</span>
                </div>
              )}
            </div>

            <div role="tablist" aria-label="Select day" className="flex gap-2 flex-wrap">
              {itinerary.map((d, i) => (
                <DayTab key={d.day} day={d} index={i} active={i === activeDay} onClick={() => setActiveDay(i)} />
              ))}
            </div>
          </div>

          {/* ── Map + Sidebar ── */}
          <div className="flex flex-row h-[560px] min-h-[480px]">

            {/* Map */}
            <div className="flex-1 relative min-w-0">
              <div
                ref={mapRef}
                className="w-full h-full"
                role="application"
                aria-label={`Map showing Day ${day.day} route from ${day.from} to ${day.to}`}
              />
              {!mapLoaded && (
                <div className="absolute inset-0 bg-[#0d1117] flex flex-col items-center justify-center gap-3.5" role="status" aria-label="Loading map">
                  <div
                    className="w-9 h-9 rounded-full border-[3px] border-t-transparent animate-spin"
                    style={{ borderColor: `${meta.color} transparent transparent transparent` }}
                    aria-hidden="true"
                  />
                  <span className="text-white/40 text-xs">Loading map…</span>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-[300px] shrink-0 bg-[#141820] overflow-y-auto border-l border-white/[0.06] flex flex-col">

              {/* Route stops */}
              <div className="p-4 border-b border-white/[0.06]">
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 m-0">Route Stops</p>
                <ol className="flex flex-col list-none m-0 p-0">
                  {meta.stops.map((stop, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold text-white z-10"
                          style={{ background: meta.color }}
                          aria-label={`Stop ${i + 1}`}
                        >
                          {i + 1}
                        </div>
                        {i < meta.stops.length - 1 && (
                          <div className="w-[2px] h-5 my-0.5" style={{ background: `${meta.color}35` }} aria-hidden="true" />
                        )}
                      </div>
                      <span className="text-white/65 text-[13px] pt-[3px] pb-2">{stop.label}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Stats */}
              <div className="flex gap-2 p-3 flex-wrap border-b border-white/[0.06]">
                <StatPill icon="🏍️" value={`${day.distance}km`} label="Distance" />
                <StatPill icon="⏱️" value={day.travelTime}       label="Ride Time" />
                <StatPill icon="⛰️" value={`${day.elevation}m`}  label="Elevation" />
              </div>

              {/* Difficulty + Stay */}
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: difficultyConfig.color }} aria-hidden="true" />
                  <span className="text-[11px] font-bold" style={{ color: difficultyConfig.color }} aria-label={`Difficulty: ${difficultyConfig.label}`}>
                    {difficultyConfig.label}
                  </span>
                </div>
                <p className="text-white/60 text-xs text-right max-w-[160px] leading-snug m-0">🏠 {day.accommodation}</p>
              </div>

              {/* Content tabs */}
              <div role="tablist" aria-label="Day details" className="flex border-b border-white/[0.06]">
                {(["highlights", "food", "tips"] as const).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex-1 py-3 px-1 bg-transparent cursor-pointer text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border-0 border-b-2"
                    style={{
                      color:             activeTab === tab ? meta.color : "rgba(255,255,255,0.3)",
                      borderBottomColor: activeTab === tab ? meta.color : "transparent",
                    }}
                  >
                    {tab === "highlights" ? "✨ Sights" : tab === "food" ? "🍜 Food" : "💡 Tips"}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div role="tabpanel" className="p-4 flex-1">
                {activeTab === "highlights" && (
                  <Section title="Highlights" icon="✨" color={meta.color}>
                    {day.highlights.map((h, i) => <ListItem key={i} text={h} />)}
                  </Section>
                )}
                {activeTab === "food" && (
                  <Section title="Food Spots" icon="🍜" color={meta.color}>
                    {day.foodSpots.map((f, i) => <ListItem key={i} text={f} />)}
                  </Section>
                )}
                {activeTab === "tips" && (
                  <Section title="Rider Tips" icon="💡" color={meta.color}>
                    {day.tips.map((t, i) => <ListItem key={i} text={t} />)}
                  </Section>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripMap;