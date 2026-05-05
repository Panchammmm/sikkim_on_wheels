import { useState } from "react";
import {
  Clock,
  Mountain,
  ChevronDown,
  Utensils,
  Lightbulb,
  Cloud,
  Droplets,
  Home,
  Route,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion, AnimatePresence } from "framer-motion";
import type { DayItinerary } from "@/data/types";

const difficultyColors: Record<DayItinerary["difficulty"], string> = {
  easy: "bg-accent/85 text-accent-foreground",
  moderate: "bg-sunset/20 text-sunset",
  challenging: "bg-destructive/20 text-destructive",
};

type Stat = {
  icon: React.ElementType;
  label: string;
  value: string;
};

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
} as const;

export default function DayCard({ data }: { data: DayItinerary }) {
  const [expanded, setExpanded] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  const hasWeather = !!data.weather;

  const stats: Stat[] = [
    { icon: Route, label: "Distance", value: `${data.distance} km` },
    { icon: Clock, label: "Time", value: data.travelTime },
    { icon: Mountain, label: "Altitude", value: `${data.elevation}m` },
    {
      icon: Cloud,
      label: "Weather",
      value: hasWeather
        ? `${data.weather.icon} ${data.weather.high}°C`
        : "—",
    },
  ];

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl"
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
              <p className="font-body text-xs text-secondary-foreground/70">
                {data.route}
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 font-body text-xs font-semibold capitalize ${difficultyColors[data.difficulty]}`}
          >
            {data.difficulty}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={`${s.label}-${i}`}
            variants={itemVariants}
            className="flex items-center gap-2 bg-card px-4 py-3"
          >
            <s.icon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-body text-[10px] text-muted-foreground">
                {s.label}
              </p>
              <p className="font-body text-sm font-semibold text-foreground">
                {s.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Highlights */}
      <div className="px-5 py-4 sm:px-6">
        <h4 className="mb-2 font-display text-sm tracking-wider text-muted-foreground">
          HIGHLIGHTS
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.highlights.map((h, i) => (
            <motion.span
              key={`${h}-${i}`}
              variants={itemVariants}
              className="rounded-full border border-border bg-muted px-3 py-1 font-body text-xs text-foreground"
            >
              {h}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Expandable */}
      <div className="border-t border-border">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label="Toggle itinerary details"
          className="flex w-full items-center justify-center gap-2 px-5 py-3 font-body text-sm text-primary transition-colors hover:bg-muted"
        >
          {expanded ? "Less details" : "More details"}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 border-t border-border px-5 py-4 sm:px-6"
              >
                {/* Accommodation */}
                <motion.div variants={itemVariants} className="flex items-start gap-3">
                  <Home className="mt-0.5 h-4 w-4 text-accent" />
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">
                      {data.accommodation}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {data.accommodationAddress}
                    </p>
                  </div>
                </motion.div>

                {/* Weather */}
                <motion.div variants={itemVariants} className="flex items-start gap-3">
                  <Droplets className="mt-0.5 h-4 w-4 text-mountain-light" />
                  <div>
                    {hasWeather ? (
                      <div className="space-y-1">
                        <p className="font-body text-sm text-foreground">
                          {data.weather.icon} {data.weather.condition}
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          🌡 {data.weather.high}°C (feels like {data.weather.feelsLike}°C)
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          💨 Wind: {data.weather.windSpeed} km/h
                        </p>
                      </div>
                    ) : (
                      <p className="font-body text-sm text-muted-foreground">
                        Fetching weather...
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Food */}
                <motion.div variants={itemVariants} className="flex items-start gap-3">
                  <Utensils className="mt-0.5 h-4 w-4 text-sunset" />
                  <div>
                    <p className="mb-1 font-body text-sm font-semibold text-foreground">
                      Food Recommendations
                    </p>
                    <ul className="space-y-1">
                      {data.foodSpots.map((f, i) => (
                        <li
                          key={`${f}-${i}`}
                          className="font-body text-xs text-muted-foreground"
                        >
                          • {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Tips */}
                <motion.div variants={itemVariants} className="flex items-start gap-3">
                  <Lightbulb className="mt-0.5 h-4 w-4 text-sunset-gold" />
                  <div>
                    <p className="mb-1 font-body text-sm font-semibold text-foreground">
                      Tips
                    </p>
                    <ul className="space-y-1">
                      {data.tips.map((t, i) => (
                        <li
                          key={`${t}-${i}`}
                          className="font-body text-xs text-muted-foreground"
                        >
                          • {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}