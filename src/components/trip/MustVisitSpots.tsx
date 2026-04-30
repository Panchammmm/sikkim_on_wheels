import { useRef, useState, useCallback, useEffect } from "react";
import { Star, Clock, Sparkles, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { mustVisitSpots } from "@/data/tripData";
import type { Spot } from "@/data/types";

// SpotCard
function SpotCard({ spot }: { spot: Spot }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* Image */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden shrink-0">
        <img
          src={spot.image}
          alt={`View of ${spot.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {spot.hidden && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-sunset-gold/20 px-2.5 py-1 text-[10px] font-semibold text-sunset-gold backdrop-blur-sm border border-sunset-gold/20">
            <Sparkles className="h-3 w-3" />
            Hidden Gem
          </span>
        )}

        <h3 className="absolute bottom-3 left-3 right-3 text-lg font-semibold text-white leading-tight">
          {spot.name}
        </h3>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3 flex-1">
          {spot.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-sunset">
              <Star className="h-3.5 w-3.5 fill-sunset" />
              <span className="font-semibold">{spot.rating}</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {spot.time}
            </span>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${spot.name} in Google Maps`}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-foreground transition hover:bg-muted active:scale-95"
          >
            <MapPin className="h-3 w-3" />
            Map
          </a>
        </div>
      </div>
    </div>
  );
}

// MustVisitSpots
export default function MustVisitSpots() {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragScrollX = useRef(0);

  const total = mustVisitSpots.length;

  // Cards visible per breakpoint — derived from container width
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCount(3);
      else if (w >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, total - visibleCount);

  // Scroll track to index
  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }, []);

  // Keep current in sync with scroll position
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || isDragging) return;
    const card = track.children[0] as HTMLElement;
    if (!card) return;
    const cardWidth = card.offsetWidth + 24; // gap-6 = 24px
    const newIndex = Math.round(track.scrollLeft / cardWidth);
    setCurrent(Math.min(newIndex, maxIndex));
  }, [isDragging, maxIndex]);

  const prev = () => {
    const next = Math.max(0, current - 1);
    setCurrent(next);
    scrollTo(next);
  };

  const next = () => {
    const n = Math.min(maxIndex, current + 1);
    setCurrent(n);
    scrollTo(n);
  };

  // Mouse drag to scroll
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.pageX;
    dragScrollX.current = trackRef.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    const dx = e.pageX - dragStartX.current;
    trackRef.current.scrollLeft = dragScrollX.current - dx;
  };

  const onMouseUp = () => {
    setIsDragging(false);
    handleScroll();
  };

  // Dot pagination
  const dots = Array.from({ length: maxIndex + 1 });

  return (
    <section ref={ref} id="spots" className="section-padding bg-muted/50 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Heading */}
        <div
          className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 transition-all duration-700
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <h2 className="text-4xl sm:text-5xl tracking-wider text-foreground">
              Must-Visit{" "}
              <span className="text-gradient-sunset">Spots</span>
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground text-sm sm:text-base">
              Handpicked locations across Sikkim — from iconic viewpoints to
              hidden gems tucked away in the mountains.
            </p>
          </div>

          {/* Nav arrows — desktop */}
          <div className="hidden sm:flex items-center gap-2 shrink-0 pb-1">
            <button
              onClick={prev}
              disabled={current === 0}
              aria-label="Previous"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card text-foreground hover:bg-muted transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              disabled={current >= maxIndex}
              aria-label="Next"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card text-foreground hover:bg-muted transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="ml-2 text-xs text-muted-foreground tabular-nums">
              {current + 1} / {maxIndex + 1}
            </span>
          </div>
        </div>

        {/* Carousel track */}
        <div className="relative mt-8 sm:mt-10">

          {/* Left fade edge */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 z-10 sm:hidden"
            style={{ background: "linear-gradient(to right, var(--muted) 0%, transparent)" }}
          />
          {/* Right fade edge */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10"
            style={{ background: "linear-gradient(to left, var(--muted) 0%, transparent)" }}
          />

          <div
            ref={trackRef}
            onScroll={handleScroll}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className={`flex gap-5 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2
              snap-x snap-mandatory
              ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
          >
            {mustVisitSpots.map((spot, i) => (
              <div
                key={spot.id}
                className={`
                  shrink-0 snap-start
                  w-[80vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-14px)]
                  transition-all duration-700
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                `}
                style={{ transitionDelay: isVisible ? `${Math.min(i, 5) * 80}ms` : "0ms" }}
              >
                <SpotCard spot={spot} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot pagination + mobile arrows */}
        <div className="mt-6 flex items-center justify-center gap-4">

          {/* Mobile prev */}
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous"
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full border border-border bg-card text-foreground hover:bg-muted transition disabled:opacity-30 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {dots.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); scrollTo(i); }}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  background: i === current
                    ? "var(--sunset, #F97316)"
                    : "var(--border)",
                }}
              />
            ))}
          </div>

          {/* Mobile next */}
          <button
            onClick={next}
            disabled={current >= maxIndex}
            aria-label="Next"
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full border border-border bg-card text-foreground hover:bg-muted transition disabled:opacity-30 active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
}