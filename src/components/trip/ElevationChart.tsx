import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { itinerary } from "@/data/tripData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ElevationChart() {
  const { ref, isVisible } = useScrollAnimation();

  const data = useMemo(
    () => [
      { name: "Siliguri", elevation: 150, day: "Start" },
      ...itinerary.map((d) => ({
        name: d.to,
        elevation: d.elevation,
        day: `Day ${d.day}`,
      })),
    ],
    [],
  );

  return (
    <section id="elevation" className="section-padding bg-background">
      <div ref={ref} className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl"
        >
          Elevation <span className="text-gradient-sunset">Profile</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-4 max-w-xl text-center font-body text-muted-foreground"
        >
          Track the altitude changes across the journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 rounded-2xl border border-border bg-card p-4 sm:p-6"
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" interval="preserveStartEnd" />

              <YAxis
                label={{
                  value: "Altitude (m)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip
                formatter={(value: number | string, _, props) => [
                  `${value}m`,
                  props.payload.day,
                ]}
              />

              <Area
                type="monotone"
                dataKey="elevation"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#elevGrad)"
                isAnimationActive={isVisible}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  );
}
