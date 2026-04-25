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

// Custom mobile-friendly tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      elevation: number;
      day: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const { name, elevation, day } = payload[0].payload;
    return (
      <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-muted-foreground">{day}</p>
        <p className="text-primary font-bold">{elevation}m</p>
      </div>
    );
  }
  return null;
};

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
      <div ref={ref} className="mx-auto max-w-5xl px-2 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-display text-center text-3xl tracking-wider text-foreground sm:text-4xl lg:text-5xl"
        >
          Elevation <span className="text-gradient-sunset">Profile</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-4 max-w-xl text-center font-body text-sm text-muted-foreground sm:text-base"
        >
          Track the altitude changes across the journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 rounded-2xl border border-border bg-card p-4 sm:mt-10 sm:p-6"
        >
          {/* Chart height shrinks on mobile */}
          <ResponsiveContainer width="100%" height={typeof window !== "undefined" && window.innerWidth < 640 ? 220 : 320}>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -10,   // Pull YAxis closer on mobile
                bottom: 0,
              }}
            >
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

              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />

              <XAxis
                dataKey="name"
                interval="preserveStartEnd"
                tick={{ fontSize: 11 }}
                tickLine={false}
                // On very small screens labels can overlap — angle them
                angle={-30}
                textAnchor="end"
                height={50}
              />

              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                width={56}
                label={{
                  value: "Altitude (m)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 14,
                  style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="elevation"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fill="url(#elevGrad)"
                dot={{ r: 3, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 5 }}
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