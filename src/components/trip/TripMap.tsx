import React, { useCallback, useEffect, useRef, useState } from "react";
import { itinerary, RouteCache, SidebarTab } from "@/data/tripData";
import {
  drawRoutePolylines,
  fetchRoadRoute,
  getDayMeta,
  loadGoogleMapsScript,
} from "@/hooks/mapUtils";
import { DayTab, MapPanel, Sidebar } from "./TripMapUI";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

// TripMap — orchestrates state, map lifecycle, and route rendering.
// All visual output is delegated to MapPanel, Sidebar, and DayTab (TripMapUI).
// All Google Maps utilities live in mapUtils.ts.

const TripMap: React.FC = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  // ── Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  // Typed overlay refs — cleared together in clearOverlays()
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  // In-memory route cache: decoded path or "fallback" sentinel per day index.
  // Prevents repeat paid API calls when the user revisits a tab.
  const routeCacheRef = useRef<RouteCache>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  // Set to true by the init effect so the day-change effect skips its first fire.
  const mapJustInitRef = useRef(false);

  // ── State
  const [activeDay, setActiveDay] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>("highlights");
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1);


  const day = itinerary[activeDay];
  const meta = getDayMeta(activeDay);

  // ── Load Maps script
  useEffect(() => {
    return loadGoogleMapsScript(googleMapsApiKey, () => setMapLoaded(true));
  }, [googleMapsApiKey]);

  // ── Clear all map overlays
  const clearOverlays = useCallback(() => {
    infoWindowsRef.current.forEach((iw) => iw.close());
    infoWindowsRef.current = [];

    listenersRef.current.forEach((h) => window.google?.maps.event.removeListener(h));
    listenersRef.current = [];

    markersRef.current.forEach((m) => { m.map = null; });
    markersRef.current = [];

    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
  }, []);

  // ── Place AdvancedMarkerElement pins for a day's stops
  // Called after importLibrary("marker") in renderDay, so AdvancedMarkerElement is guaranteed available.
  const placeMarkers = useCallback((
    map: google.maps.Map,
    m: ReturnType<typeof getDayMeta>,
    dayIdx: number
  ) => {
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
        map, title: stop.label, content: pinEl, zIndex: 10,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;font-size:13px;color:#111;padding:6px 8px;line-height:1.6;min-width:130px">
          <strong style="font-size:14px">${stop.label}</strong><br/>
          <span style="color:#777;font-size:11px">Stop ${i + 1} of ${m.stops.length} &middot; Day ${d.day}</span>
        </div>`,
      });

      const handle = marker.addListener("gmp-click", () => infoWindow.open({ map, anchor: marker }));
      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
      listenersRef.current.push(handle);
    });
  }, []);

  // ── fitBounds helper with padding, called after drawing a path or placing markers. Single fitBounds call
  const fitPath = useCallback((map: google.maps.Map, path: { lat: number; lng: number }[]) => {
    const bounds = new window.google.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, { top: 60, right: 40, bottom: 60, left: 40 });
  }, []);

  // ── Render a day: cache check → fetch → draw 
  const renderDay = useCallback(async (dayIndex: number) => {
    if (!mapInstanceRef.current || !window.google?.maps) return;

    // importLibrary is idempotent — guarantees AdvancedMarkerElement is ready
    // even if the libraries=marker param in the script URL loaded asynchronously.
    await window.google.maps.importLibrary("marker");
    if (!mapInstanceRef.current) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const map = mapInstanceRef.current;
    const m = getDayMeta(dayIndex);

    // Cache hit — draw immediately, zero API cost, no loading state
    const cached = routeCacheRef.current[dayIndex];
    if (cached !== undefined) {
      clearOverlays();
      const path = cached === "fallback" ? m.stops.map((s) => ({ lat: s.lat, lng: s.lng })) : cached;
      polylinesRef.current = drawRoutePolylines(map, path, m.color);
      placeMarkers(map, m, dayIndex);
      fitPath(map, path);
      return;
    }

    // Cache miss — fetch. Keep previous overlays visible to avoid empty-map flicker.
    setRouteLoading(true);
    const roadPath = await fetchRoadRoute(m.stops, googleMapsApiKey, controller.signal);
    if (controller.signal.aborted) return; // superseded by a later renderDay call

    setRouteLoading(false);
    routeCacheRef.current[dayIndex] = roadPath ?? "fallback";

    // Clear only once the new path is ready — no visible gap
    clearOverlays();
    const drawPath = roadPath ?? m.stops.map((s) => ({ lat: s.lat, lng: s.lng }));
    polylinesRef.current = drawRoutePolylines(map, drawPath, m.color);
    placeMarkers(map, m, dayIndex);
    // Single fitBounds — road path if available, stop coords otherwise. No double-snap.
    fitPath(map, drawPath);
  }, [clearOverlays, placeMarkers, fitPath, googleMapsApiKey]);

  // ── Initialise map once the API is loaded. renderDay(0) to show the first day by default.
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    // mapId and styles[] are mutually exclusive. AdvancedMarkerElement requires
    // mapId, so styles[] is omitted. Apply styling in Google Cloud Console.
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      mapTypeId: "roadmap", zoom: 9, center: { lat: 27.1, lng: 88.3 },
      zoomControl: true, mapTypeControl: false, streetViewControl: false, fullscreenControl: true,
      mapId: import.meta.env.VITE_GOOGLE_MAP_ID ?? "DEMO_MAP_ID",
    });

    mapJustInitRef.current = true;
    renderDay(0);
  }, [mapLoaded, renderDay]);

  // ── Re-render on day tab change
  useEffect(() => {
    if (mapJustInitRef.current) { mapJustInitRef.current = false; return; }
    if (mapLoaded && mapInstanceRef.current) {
      renderDay(activeDay);
      setActiveTab((prev) => (prev === "highlights" ? prev : "highlights"));
    }
  }, [activeDay, mapLoaded, renderDay]);

  // ── Unmount cleanup
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      clearOverlays();
      mapInstanceRef.current = null;
    };
  }, [clearOverlays]);

  // ── Render 
  return (
    <section ref={sectionRef} id="trip-map" className="py-10 sm:py-16 bg-background">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="mb-8">
          <h1 className={`text-center font-display text-3xl sm:text-4xl lg:text-5xl tracking-wider text-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            Explore the <span className="text-gradient-sunset">Ride Route</span>
          </h1>
          <p className={`mx-auto mt-3 sm:mt-4 max-w-xl text-center font-body text-muted-foreground text-sm sm:text-base transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}>
            Follow your journey across Sikkim with live GPS tracking and real road routes.
          </p>
        </div>

        {/* Card */}
        <div className={`bg-[#0d1117] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/[0.06] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: isVisible ? "250ms" : "0ms" }}>

          {/* Card header: day label + loading indicator + day tabs */}
          <div
            className="border-b border-white/[0.08] px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4"
            style={{ background: `linear-gradient(135deg, ${meta.color}22 0%, transparent 60%)` }}
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm text-white shrink-0"
                style={{ background: meta.color }}
                aria-hidden="true"
              >
                D{day.day}
              </div>
              <div className="flex-1 min-w-0">
                {/* Truncate on very small screens */}
                <p className="text-white font-bold text-sm sm:text-base tracking-wide m-0 truncate">
                  {day.from} → {day.to}
                </p>
                <p className="text-white/40 text-[11px] sm:text-xs mt-0.5 m-0 truncate">{day.route}</p>
              </div>
              {routeLoading && (
                <div
                  className="flex items-center gap-1.5 sm:gap-2 text-white/40 text-[11px] sm:text-xs shrink-0"
                  role="status"
                  aria-live="polite"
                  aria-label="Finding road route"
                >
                  <div
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-t-transparent animate-spin shrink-0"
                    style={{ borderColor: `${meta.color} transparent transparent transparent` }}
                    aria-hidden="true"
                  />
                  {/* Hide text on very small screens to prevent header overflow */}
                  <span className="hidden xs:inline">Finding road…</span>
                </div>
              )}
            </div>

            {/* Day tabs — scrollable on mobile so they never wrap to two lines */}
            <div
              role="tablist"
              aria-label="Select day"
              className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 -mx-1 px-1 scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {itinerary.map((d, i) => (
                <DayTab key={d.day} day={d} index={i} active={i === activeDay} onClick={() => setActiveDay(i)} />
              ))}
            </div>
          </div>

          {/* Map + Sidebar
              Mobile:  stacked (flex-col) — map on top, sidebar below
              Desktop: side-by-side (sm:flex-row) — original layout
          */}
          <div className="flex flex-col sm:flex-row sm:h-[560px] sm:min-h-[480px]">
            <MapPanel
              mapRef={mapRef}
              mapLoaded={mapLoaded}
              accentColor={meta.color}
              dayLabel={`Map showing Day ${day.day} route from ${day.from} to ${day.to}`}
            />
            <Sidebar
              day={day}
              meta={meta}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default TripMap;