import { itinerary } from "@/data/tripData";
import DayCard from "./DayCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ItinerarySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="itinerary" className="section-padding bg-muted/50">
      <div className="mx-auto max-w-4xl">
        <div ref={ref}>
          <h2
            className={`font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            Day-by-Day <span className="text-gradient-sunset">Itinerary</span>
          </h2>
          <p
            className={`mx-auto mt-4 max-w-xl text-center font-body text-muted-foreground ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: "0.15s" }}
          >
            Five days of winding roads, ancient monasteries, and panoramic Himalayan vistas.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {itinerary.map((day) => (
            <DayCard key={day.day} data={day} />
          ))}
        </div>
      </div>
    </section>
  );
}
