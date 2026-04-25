import {
  MapPin,
  Mountain,
  Gauge,
  Calendar,
  Route,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { totalDistance } from "@/data/tripData";

type Stat = {
  icon: React.ElementType;
  label: string;
  value: string;
};

const stats: Stat[] = [
  { icon: Route, label: "Total Distance", value: `${totalDistance} km` },
  { icon: MapPin, label: "Start / End", value: "New Jalpaiguri" },
  { icon: Mountain, label: "Max Altitude", value: "2,200m" },
  { icon: Clock, label: "Duration", value: "5 Days" },
  { icon: Calendar, label: "Best Season", value: "Oct - May" },
  { icon: Gauge, label: "Difficulty", value: "Moderate" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
} as const;

export default function TripOverview() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="overview" className="section-padding bg-background">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="mx-auto max-w-6xl"
      >
        <motion.h2
          variants={itemVariants}
          className="font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl"
        >
          Trip <span className="text-gradient-sunset">Overview</span>
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-4 max-w-2xl text-center font-body text-muted-foreground"
        >
          A thrilling motorcycle ride through the enchanting landscapes of West Sikkim
          from the plains of Siliguri to the monastery-dotted hills near Kanchenjunga.
        </motion.p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, i) => (
            <motion.div
              key={`${s.label}-${i}`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-body text-xs text-muted-foreground">
                {s.label}
              </span>
              <span className="font-display text-lg tracking-wide text-foreground">
                {s.value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}