import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  RefreshCw,
} from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { animate } from "framer-motion";
import { useEffect, useState } from "react";

const formatDate = (date: string) =>
  new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

// AnimatedNumber
const AnimatedNumber = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(display, value, {
      duration: 0.6,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });

    return () => controls.stop();
  }, [value]); // only depend on value

  return <span>{display}</span>;
};

export default function WeatherDashboard() {
  const { ref, isVisible } = useScrollAnimation();

  // React Query version
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useWeather();

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // update timestamp only when fresh data arrives
  useEffect(() => {
    if (!isLoading && !isError && data.length) {
      setLastUpdated(new Date());
    }
  }, [data, isLoading, isError]);

  return (
    <section
      id="weather"
      aria-labelledby="weather-heading"
      className="section-padding bg-muted/50"
    >
      <div ref={ref} className="mx-auto max-w-5xl">
        {/* Header */}
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
            className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs text-muted-foreground hover:bg-muted transition disabled:opacity-50"
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* 🕒 Last Updated */}
        {lastUpdated && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Updated at {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {/* 🔄 Loading Skeleton */}
        {isLoading && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
        )}

        {/* ❌ Error */}
        {isError && (
          <p className="mt-10 text-center text-sm text-destructive">
            Failed to load weather data
          </p>
        )}

        {/* Weather Cards */}
        {!isLoading && !isError && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((loc, i) => {
              if (!loc.current) return null;

              return (
                <div
                  key={`${loc.location}-${i}`}
                  className={`overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl ${isVisible ? "animate-fade-in-up" : "opacity-0"
                    }`}
                  style={{
                    animationDelay: `${Math.min(i, 6) * 0.08}s`,
                  }}
                >
                  {/* Current */}
                  <div className="border-b border-border bg-gradient-mountain px-5 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg tracking-wide text-secondary-foreground">
                        {loc.location}
                      </h3>
                      <span className="text-3xl">{loc.current.icon}</span>
                    </div>

                    <p className="font-display text-4xl text-secondary-foreground">
                      <AnimatedNumber value={loc.current.temp} />°C
                    </p>

                    <p className="text-xs text-secondary-foreground/70">
                      {loc.current.condition}
                    </p>

                    <div className="mt-3 flex gap-4">
                      <span className="flex items-center gap-1 text-xs text-secondary-foreground/70">
                        <Droplets className="h-3 w-3" />
                        <AnimatedNumber value={loc.current.humidity} />%
                      </span>

                      <span className="flex items-center gap-1 text-xs text-secondary-foreground/70">
                        <Wind className="h-3 w-3" />
                        <AnimatedNumber value={loc.current.windSpeed} /> km/h
                      </span>
                    </div>
                  </div>

                  {/* Forecast */}
                  <div className="divide-y divide-border">
                    {loc.daily?.map((d) => (
                      <div
                        key={d.date}
                        className="flex items-center justify-between px-4 py-2.5"
                      >
                        <span className="w-20 text-xs text-muted-foreground">
                          {formatDate(d.date)}
                        </span>

                        <span className="text-lg">{d.icon}</span>

                        <span className="flex items-center gap-1 text-xs text-foreground">
                          <Thermometer className="h-3 w-3 text-destructive/60" />
                          {d.high}°
                          <span className="text-muted-foreground">
                            / {d.low}°
                          </span>
                        </span>

                        <span
                          className={`flex items-center gap-1 text-xs ${d.rain > 60
                              ? "text-blue-500 font-semibold"
                              : "text-muted-foreground"
                            }`}
                        >
                          <Cloud className="h-3 w-3" />
                          {d.rain}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}