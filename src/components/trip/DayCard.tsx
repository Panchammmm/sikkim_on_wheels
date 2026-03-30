import { useState } from "react";
import {
  MapPin,
  Clock,
  Mountain,
  ChevronDown,
  ChevronUp,
  Utensils,
  Lightbulb,
  Cloud,
  Droplets,
  Home,
  Route,
} from "lucide-react";
import type { DayItinerary } from "@/data/tripData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const difficultyColors = {
  easy: "bg-accent text-accent-foreground",
  moderate: "bg-sunset/20 text-sunset",
  challenging: "bg-destructive/20 text-destructive",
};

export default function DayCard({ data }: { data: DayItinerary }) {
  const [expanded, setExpanded] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:shadow-xl ${
        isVisible ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${data.day * 0.1}s` }}
    >
      {/* Header */}
      <div className="bg-gradient-mountain px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground">
              {data.day}
            </span>
            <div>
              <h3 className="font-display text-xl tracking-wide text-secondary-foreground">
                {data.from} → {data.to}
              </h3>
              <p className="font-body text-xs text-secondary-foreground/70">{data.route}</p>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 font-body text-xs font-semibold capitalize ${difficultyColors[data.difficulty]}`}>
            {data.difficulty}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
        {[
          { icon: Route, label: "Distance", value: `${data.distance} km` },
          { icon: Clock, label: "Time", value: data.travelTime },
          { icon: Mountain, label: "Altitude", value: `${data.elevation}m` },
          { icon: Cloud, label: "Weather", value: `${data.weather.high}°/${data.weather.low}°C` },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 bg-card px-4 py-3">
            <s.icon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-body text-[10px] text-muted-foreground">{s.label}</p>
              <p className="font-body text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Highlights */}
      <div className="px-5 py-4 sm:px-6">
        <h4 className="mb-2 font-display text-sm tracking-wider text-muted-foreground">HIGHLIGHTS</h4>
        <div className="flex flex-wrap gap-2">
          {data.highlights.map((h) => (
            <span key={h} className="rounded-full border border-border bg-muted px-3 py-1 font-body text-xs text-foreground">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Expandable */}
      <div className="border-t border-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-2 px-5 py-3 font-body text-sm text-primary transition-colors hover:bg-muted"
        >
          {expanded ? "Less details" : "More details"}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {expanded && (
          <div className="space-y-4 border-t border-border px-5 py-4 sm:px-6">
            {/* Accommodation */}
            <div className="flex items-start gap-3">
              <Home className="mt-0.5 h-4 w-4 text-accent" />
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{data.accommodation}</p>
                <p className="font-body text-xs text-muted-foreground">{data.accommodationAddress}</p>
              </div>
            </div>

            {/* Weather */}
            <div className="flex items-start gap-3">
              <Droplets className="mt-0.5 h-4 w-4 text-mountain-light" />
              <div>
                <p className="font-body text-sm text-foreground">
                  {data.weather.condition} · Rain chance: {data.weather.rain}%
                </p>
              </div>
            </div>

            {/* Food */}
            <div className="flex items-start gap-3">
              <Utensils className="mt-0.5 h-4 w-4 text-sunset" />
              <div>
                <p className="mb-1 font-body text-sm font-semibold text-foreground">Food Recommendations</p>
                <ul className="space-y-1">
                  {data.foodSpots.map((f) => (
                    <li key={f} className="font-body text-xs text-muted-foreground">• {f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tips */}
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-4 w-4 text-sunset-gold" />
              <div>
                <p className="mb-1 font-body text-sm font-semibold text-foreground">Tips</p>
                <ul className="space-y-1">
                  {data.tips.map((t) => (
                    <li key={t} className="font-body text-xs text-muted-foreground">• {t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
