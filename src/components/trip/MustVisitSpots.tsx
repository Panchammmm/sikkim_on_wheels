import { Star, Clock, Sparkles, MapPin } from "lucide-react";
import { mustVisitSpots } from "@/data/tripData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// ── Types
type Spot = (typeof mustVisitSpots)[number];

type SpotCardProps = {
  spot: Spot;
  index: number;
  isVisible: boolean;
};

// ── SpotCard 
function SpotCard({ spot, index, isVisible }: SpotCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card
      transition-all duration-700 ease-out
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      hover:-translate-y-2 hover:shadow-2xl`}
      style={{
        // Only apply stagger delay during the entry animation.
        // Once visible, delay is cleared so hover responds instantly.
        transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
      }}
    >
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={spot.image}
          alt={`View of ${spot.name}`}
          // Lazy-load images below the fold to avoid blocking bandwidth
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {spot.hidden && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-sunset-gold/20 px-2.5 py-1 text-[10px] font-semibold text-sunset-gold backdrop-blur">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> Hidden Gem
          </span>
        )}

        <h3 className="absolute bottom-3 left-3 right-3 font-display text-lg text-white">
          {spot.name}
        </h3>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {spot.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-sm text-sunset">
              <Star className="h-4 w-4 fill-sunset" aria-hidden="true" />
              <span aria-label={`Rating: ${spot.rating} out of 5`}>{spot.rating}</span>
            </span>

            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {spot.time}
            </span>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            // Descriptive label so screen readers announce the destination, not just "Map"
            aria-label={`Open ${spot.name} in Google Maps`}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-foreground transition hover:bg-muted"
          >
            <MapPin className="h-3 w-3" aria-hidden="true" />
            Map
          </a>
        </div>
      </div>
    </div>
  );
}

// ── MustVisitSpots
export default function MustVisitSpots() {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section ref={ref} id="spots" className="section-padding bg-muted/50">
      <div className="mx-auto max-w-6xl px-4">

        {/* Heading */}
        <h2
          className={`text-center font-display text-4xl tracking-wider text-foreground sm:text-5xl
          transition-all duration-700
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          Must-Visit <span className="text-gradient-sunset">Spots</span>
        </h2>

        {/* Subheading */}
        <p
          className={`mx-auto mt-4 max-w-xl text-center font-body text-muted-foreground
          transition-all duration-700
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
        >
          Discover handpicked locations across Sikkim — from iconic viewpoints
          to hidden gems tucked away in the mountains.
        </p>

        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mustVisitSpots.map((spot, i) => (
            <SpotCard
              key={spot.name}
              spot={spot}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>

      </div>
    </section>
  );
}