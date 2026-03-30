import { MapPin, Mountain, Gauge, Calendar, Route, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { totalDistance } from "@/data/tripData";

const stats = [
  { icon: Route, label: "Total Distance", value: `${totalDistance} km` },
  { icon: MapPin, label: "Start / End", value: "Siliguri" },
  { icon: Mountain, label: "Max Altitude", value: "2,200m" },
  { icon: Clock, label: "Duration", value: "5 Days" },
  { icon: Calendar, label: "Best Season", value: "Oct - May" },
  { icon: Gauge, label: "Difficulty", value: "Moderate" },
];

export default function TripOverview() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="overview" className="section-padding bg-background">
      <div ref={ref} className="mx-auto max-w-6xl">
        <h2
          className={`font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          Trip <span className="text-gradient-sunset">Overview</span>
        </h2>
        <p
          className={`mx-auto mt-4 max-w-2xl text-center font-body text-muted-foreground ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.15s" }}
        >
          A thrilling motorcycle ride through the enchanting landscapes of West Sikkim —
          from the plains of Siliguri to the monastery-dotted hills near Kanchenjunga.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-shadow hover:shadow-lg ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${0.1 * (i + 2)}s` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-body text-xs text-muted-foreground">{s.label}</span>
              <span className="font-display text-lg tracking-wide text-foreground">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
