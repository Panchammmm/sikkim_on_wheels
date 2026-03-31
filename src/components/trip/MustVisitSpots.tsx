import { Star, Clock, Sparkles, MapPin } from "lucide-react";
import { motion, easeOut } from "framer-motion";
import { mustVisitSpots } from "@/data/tripData";

/* ANIMATION VARIANTS */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

/* CARD */

function SpotCard({ spot }) {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card 
      transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={spot.image}
          alt={spot.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Hidden Gem Badge */}
        {spot.hidden && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-sunset-gold/20 px-2.5 py-1 text-[10px] font-semibold text-sunset-gold backdrop-blur">
            <Sparkles className="h-3 w-3" /> Hidden Gem
          </span>
        )}

        {/* Title on image */}
        <h3 className="absolute bottom-3 left-3 right-3 font-display text-lg text-white">
          {spot.name}
        </h3>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Description */}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {spot.description}
        </p>

        {/* Meta */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-sm text-sunset">
              <Star className="h-4 w-4 fill-sunset" />
              {spot.rating}
            </span>

            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {spot.time}
            </span>
          </div>

          {/* Map Button */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              spot.name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-foreground transition hover:bg-muted"
          >
            <MapPin className="h-3 w-3" />
            Map
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* MAIN */

export default function MustVisitSpots() {
  return (
    <section
      id="spots"
      aria-labelledby="spots-heading"
      className="section-padding bg-muted/50"
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          id="spots-heading"
          className="text-center font-display text-4xl tracking-wider text-foreground sm:text-5xl"
        >
          Must-Visit{" "}
          <span className="text-gradient-sunset">Spots</span>
        </motion.h2>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {mustVisitSpots.map((spot, i) => (
            <SpotCard key={`${spot.name}-${i}`} spot={spot} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}