import { Star, Clock, Sparkles } from "lucide-react";
import { mustVisitSpots } from "@/data/tripData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function MustVisitSpots() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="spots" className="section-padding bg-muted/50">
      <div ref={ref} className="mx-auto max-w-5xl">
        <h2
          className={`font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          Must-Visit <span className="text-gradient-sunset">Spots</span>
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mustVisitSpots.map((spot, i) => (
            <div
              key={spot.name}
              className={`relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${0.08 * (i + 2)}s` }}
            >
              {spot.hidden && (
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-sunset-gold/20 px-2.5 py-1 font-body text-[10px] font-semibold text-sunset-gold">
                  <Sparkles className="h-3 w-3" /> Hidden Gem
                </span>
              )}
              <h3 className="font-display text-lg tracking-wide text-foreground">{spot.name}</h3>
              <p className="mt-2 font-body text-xs text-muted-foreground leading-relaxed">{spot.description}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="flex items-center gap-1 font-body text-sm text-sunset">
                  <Star className="h-4 w-4 fill-sunset" /> {spot.rating}
                </span>
                <span className="flex items-center gap-1 font-body text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {spot.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
