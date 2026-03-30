import { Cloud, Droplets, Wind, Thermometer, RefreshCw } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function WeatherDashboard() {
  const { ref, isVisible } = useScrollAnimation();
  const { data, loading, error } = useWeather();

  return (
    <section id="weather" className="section-padding bg-muted/50">
      <div ref={ref} className="mx-auto max-w-5xl">
        <h2
          className={`font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          Live <span className="text-gradient-sunset">Weather</span>
        </h2>
        <p
          className={`mx-auto mt-3 max-w-lg text-center font-body text-sm text-muted-foreground ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          Real-time conditions from Open-Meteo for each stop on the route.
        </p>

        {loading && (
          <div className="mt-10 flex items-center justify-center gap-2 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="font-body text-sm">Fetching live weather…</span>
          </div>
        )}

        {error && (
          <p className="mt-10 text-center font-body text-sm text-destructive">{error}</p>
        )}

        {!loading && !error && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((loc, i) => (
              <div
                key={loc.location}
                className={`overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.08 * (i + 2)}s` }}
              >
                {/* Current */}
                <div className="border-b border-border bg-gradient-mountain px-5 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg tracking-wide text-secondary-foreground">
                      {loc.location}
                    </h3>
                    <span className="text-3xl">{loc.current?.icon}</span>
                  </div>
                  <p className="font-display text-4xl text-secondary-foreground">
                    {loc.current?.temp}°C
                  </p>
                  <p className="font-body text-xs text-secondary-foreground/70">
                    {loc.current?.condition}
                  </p>
                  <div className="mt-3 flex gap-4">
                    <span className="flex items-center gap-1 font-body text-xs text-secondary-foreground/70">
                      <Droplets className="h-3 w-3" /> {loc.current?.humidity}%
                    </span>
                    <span className="flex items-center gap-1 font-body text-xs text-secondary-foreground/70">
                      <Wind className="h-3 w-3" /> {loc.current?.windSpeed} km/h
                    </span>
                  </div>
                </div>

                {/* 5-day forecast */}
                <div className="divide-y divide-border">
                  {loc.daily.map((d) => (
                    <div key={d.date} className="flex items-center justify-between px-4 py-2.5">
                      <span className="font-body text-xs text-muted-foreground w-20">
                        {new Date(d.date + "T00:00:00").toLocaleDateString("en-IN", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-lg">{d.icon}</span>
                      <span className="flex items-center gap-1 font-body text-xs text-foreground">
                        <Thermometer className="h-3 w-3 text-destructive/60" />
                        {d.high}°
                        <span className="text-muted-foreground">/ {d.low}°</span>
                      </span>
                      <span className="flex items-center gap-1 font-body text-xs text-muted-foreground">
                        <Cloud className="h-3 w-3" /> {d.rain}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
