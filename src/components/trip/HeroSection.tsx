import { useEffect, useState } from "react";
import { ChevronDown, MapPin, Calendar, Route } from "lucide-react";
import heroImage from "@/assets/hero-mountain.jpg";
import { TRIP_START_DATE, totalDistance } from "@/data/tripData";

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function HeroSection() {
  const [time, setTime] = useState(getTimeLeft(TRIP_START_DATE));
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft(TRIP_START_DATE)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const countdownItems = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <section id="hero" className="relative h-screen min-h-[700px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          transform: `translateY(${offset}px)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-body text-sm font-medium text-primary-foreground/80">West Sikkim, India</span>
        </div>

        <h1 className="font-display text-5xl leading-none tracking-wider text-primary-foreground sm:text-7xl lg:text-8xl">
          West Sikkim
          <br />
          <span className="text-gradient-sunset">Motorcycle Adventure</span>
        </h1>

        <div className="mt-6 flex items-center gap-4 font-body text-sm font-medium text-primary-foreground/70 sm:gap-6 sm:text-base">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> 5 Days | 4 Nights
          </span>
          <span className="h-4 w-px bg-primary-foreground/30" />
          <span className="flex items-center gap-1.5">
            <Route className="h-4 w-4" /> {totalDistance} km
          </span>
        </div>

        <div className="mt-10 grid grid-cols-4 gap-3 sm:gap-5">
          {countdownItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center rounded-xl border border-primary-foreground/10 bg-night/40 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4"
            >
              <span className="font-display text-3xl text-primary sm:text-4xl">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="font-body text-xs text-primary-foreground/60">{item.label}</span>
            </div>
          ))}
        </div>

        <a
          href="#overview"
          className="mt-14 flex flex-col items-center gap-1 text-primary-foreground/50 transition-colors hover:text-primary"
        >
          <span className="font-body text-xs uppercase tracking-widest">Explore the route</span>
          <ChevronDown className="h-6 w-6 animate-bounce-scroll" />
        </a>
      </div>
    </section>
  );
}
