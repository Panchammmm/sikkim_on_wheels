import { Cloud, Droplets, Wind, RefreshCw } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { WeatherData } from "@/data/types";
import { animate } from "framer-motion";
import { useEffect, useState } from "react";

const formatDate = (date: string) =>
  new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

// AnimatedNumber
const AnimatedNumber = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.6,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);
  return <span>{display}</span>;
};

// RainBar
const RainBar = ({ value }: { value: number }) => (
  <div className="flex items-center gap-1.5 w-full">
    <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          background: value > 60 ? "#3B82F6" : value > 30 ? "#93C5FD" : "#CBD5E1",
        }}
      />
    </div>
    <span
      className="text-[11px] font-mono w-7 text-right tabular-nums shrink-0"
      style={{ color: value > 60 ? "#3B82F6" : "var(--muted-foreground)" }}
    >
      {value}%
    </span>
  </div>
);

// StatChip
const StatChip = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1 bg-black/10 rounded-xl p-3 flex-1">
    <div className="flex items-center gap-1.5 text-secondary-foreground/60">
      {icon}
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-secondary-foreground font-semibold text-sm">{value}</span>
  </div>
);

// Location Tab
const LocationTab = ({
  loc,
  active,
  onClick,
}: {
  loc: WeatherData;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col items-center gap-0.5 px-3 sm:px-5 py-3 text-xs font-semibold
      whitespace-nowrap transition-all duration-200 shrink-0 border-b-2 min-w-[64px]
      ${active
        ? "border-orange-500 text-foreground bg-orange-500/[0.05]"
        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }
    `}
  >
    <span className="text-lg sm:text-xl">{loc.current!.icon}</span>
    {/* Show short name on mobile, full on sm+ */}
    <span className="tracking-wide text-[11px] sm:text-xs">
      {loc.location}
    </span>
    <span
      className="font-mono text-[10px] sm:text-[11px] tabular-nums"
      style={{ color: active ? "#F97316" : "var(--muted-foreground)" }}
    >
      {loc.current!.temp}°C
    </span>
  </button>
);

// Main Component
export default function WeatherDashboard() {
  const { ref, isVisible } = useScrollAnimation();
  const { data = [], isLoading, isError, refetch, isFetching } = useWeather();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // update timestamp only when fresh data arrives
  useEffect(() => {
    if (!isLoading && !isError && data.length) {
      setLastUpdated(new Date());
      setActiveTab(0);
    }
  }, [data, isLoading, isError]);

  const active: WeatherData | undefined = data[activeTab];

  return (
    <section
      id="weather"
      aria-labelledby="weather-heading"
      className="section-padding bg-muted/50"
    >
      <div ref={ref} className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* Heading */}
        <h2
          id="weather-heading"
          className={`font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl ${isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
        >
          Live <span className="text-gradient-sunset">Weather</span>
        </h2>

        <p
          className={`mx-auto mt-3 max-w-lg text-center font-body text-sm text-muted-foreground ${isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          style={{ animationDelay: "0.1s" }}
        >
          Real-time conditions from Open-Meteo for each stop on the route.
        </p>

        {/* 🔄 Refresh Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground hover:bg-muted transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} />
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated at {formatTime(lastUpdated)}
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="mt-8 sm:mt-10 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex border-b border-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 sm:h-16 flex-1 animate-pulse bg-muted/50" />
              ))}
            </div>
            <div className="h-60 sm:h-72 animate-pulse bg-card" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <p className="mt-8 text-center text-sm text-destructive">
            Failed to load weather data.{" "}
            <button onClick={() => refetch()} className="underline">Retry</button>
          </p>
        )}

        {/* Tabbed card */}
        {!isLoading && !isError && data.length > 0 && (
          <div
            className={`mt-8 sm:mt-10 rounded-2xl border border-border bg-card overflow-hidden shadow-sm
              ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: "0.15s" }}
          >

            {/* Location tab bar */}
            <div className="flex overflow-x-auto border-b border-border scrollbar-thin scrollbar-thumb-muted/50 scrollbar-track-transparent">
              {data.map((loc, i) => (
                <LocationTab
                  key={loc.location}
                  loc={loc}
                  active={i === activeTab}
                  onClick={() => setActiveTab(i)}
                />
              ))}
            </div>

            {/* Active panel */}
            {active && (
              <div className="flex flex-col lg:flex-row">

                {/* Current conditions (top on mobile, left on desktop) */}
                <div className="lg:w-[260px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-gradient-mountain p-4 sm:p-6 flex flex-col gap-4">

                  {/* On mobile: horizontal layout — icon + temp side by side */}
                  <div className="flex items-center justify-between lg:block">

                    {/* Left side: label + location name */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-secondary-foreground/50">
                        Current
                      </p>
                      <h3 className=" font-display text-lg sm:text-xl tracking-wide text-secondary-foreground mt-0.5">
                        {active.location}
                      </h3>
                    </div>

                    {/* Right side: icon + temp (horizontal on mobile, stacked on desktop) */}
                    <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-0 lg:mt-4">
                      <span className="text-4xl sm:text-5xl">{active.current!.icon}</span>
                      <div className="lg:mt-3">
                        <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-foreground leading-none">
                          <AnimatedNumber value={active.current!.temp} />
                          <span className="text-2xl sm:text-3xl font-normal text-secondary-foreground/50">°C</span>
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-secondary-foreground/70">
                          {active.current!.condition}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stat chips — full width row on all sizes */}
                  <div className="flex gap-2">
                    <StatChip
                      icon={<Droplets className="h-3 w-3" />}
                      label="Humidity"
                      value={<><AnimatedNumber value={active.current!.humidity} />%</>}
                    />
                    <StatChip
                      icon={<Wind className="h-3 w-3" />}
                      label="Wind"
                      value={<><AnimatedNumber value={active.current!.windSpeed} />{" "}km/h</>}
                    />
                  </div>

                  {/* Coordinates — hidden on small mobile to save space */}
                  <p className="hidden sm:block text-[10px] text-secondary-foreground/40 font-mono mt-auto">
                    {active.lat.toFixed(3)}°N · {active.lon.toFixed(3)}°E
                  </p>
                </div>

                {/* 5-day forecast */}
                <div className="flex-1 flex flex-col min-w-0">

                  {/* Column headers — simplified on mobile */}
                  <div className="grid grid-cols-[1fr_auto_auto_1fr] sm:grid-cols-[1fr_auto_auto_1fr_1fr] gap-2 sm:gap-3 items-center px-4 sm:px-6 pt-3 pb-2 border-b border-border">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Date</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-6 sm:w-8" />
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Hi / Lo</span>
                    
                    {/* Range bar header — hidden on mobile */}
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:block">Range</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                      <Cloud className="h-3 w-3" />
                      <span className="hidden xs:inline">Rain</span>
                    </span>
                  </div>

                  {/* Forecast rows */}
                  <div className="flex flex-col divide-y divide-border flex-1">
                    {active.daily.map((d) => (
                      <div
                        key={d.date}
                        className="grid grid-cols-[1fr_auto_auto_1fr] sm:grid-cols-[1fr_auto_auto_1fr_1fr] gap-2 sm:gap-3 items-center px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-muted/30 transition-colors"
                      >
                        {/* Date — abbreviated on mobile */}
                        <span className="text-[11px] sm:text-xs text-muted-foreground truncate">
                          {formatDate(d.date)}
                        </span>

                        {/* Weather icon */}
                        <span className="text-base sm:text-xl w-6 sm:w-8 text-center">{d.icon}</span>

                        {/* Hi / Lo */}
                        <div className="flex items-baseline gap-0.5 sm:gap-1 whitespace-nowrap">
                          <span className="text-xs sm:text-sm font-semibold text-foreground tabular-nums">
                            {d.high}°
                          </span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground tabular-nums">
                            /{d.low}°
                          </span>
                        </div>

                        {/* Temp range bar — hidden on mobile */}
                        <div className="hidden sm:block">
                          <div className="h-1.5 rounded-full bg-border overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                marginLeft: `${Math.max(0, Math.min(90, ((d.low - 5) / 35) * 100))}%`,
                                width: `${Math.max(8, Math.min(90, ((d.high - d.low) / 35) * 100))}%`,
                                background: "linear-gradient(90deg, #93C5FD, #FCD34D, #F97316)",
                              }}
                            />
                          </div>
                        </div>

                        {/* Rain bar */}
                        <RainBar value={d.rain} />
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-border bg-muted/20">
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <Cloud className="h-3 w-3 shrink-0" />
                      <span>Rain = precipitation probability · Open-Meteo</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}