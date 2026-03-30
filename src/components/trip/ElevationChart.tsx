import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { itinerary } from "@/data/tripData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const data = [
  { name: "Siliguri", elevation: 150, day: "Start" },
  ...itinerary.map((d) => ({ name: d.to, elevation: d.elevation, day: `Day ${d.day}` })),
];

export default function ElevationChart() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="elevation" className="section-padding bg-background">
      <div ref={ref} className="mx-auto max-w-5xl">
        <h2
          className={`font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          Elevation <span className="text-gradient-sunset">Profile</span>
        </h2>
        <p
          className={`mx-auto mt-4 max-w-xl text-center font-body text-muted-foreground ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.15s" }}
        >
          Track the altitude changes across the 5-day journey.
        </p>

        <div
          className={`mt-10 rounded-2xl border border-border bg-card p-4 sm:p-6 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.3s" }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(24, 85%, 55%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(24, 85%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,87%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "Inter" }} stroke="hsl(215,12%,50%)" />
              <YAxis
                tick={{ fontSize: 12, fontFamily: "Inter" }}
                stroke="hsl(215,12%,50%)"
                label={{ value: "Altitude (m)", angle: -90, position: "insideLeft", style: { fontSize: 12, fontFamily: "Inter" } }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0,0%,100%)",
                  border: "1px solid hsl(210,18%,87%)",
                  borderRadius: "8px",
                  fontFamily: "Inter",
                  fontSize: "13px",
                }}
                formatter={(value: number) => [`${value}m`, "Elevation"]}
              />
              <Area
                type="monotone"
                dataKey="elevation"
                stroke="hsl(24, 85%, 55%)"
                strokeWidth={3}
                fill="url(#elevGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
