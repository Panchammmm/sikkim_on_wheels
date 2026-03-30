import { useState } from "react";
import { IndianRupee } from "lucide-react";
import { budgetCategories } from "@/data/tripData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function BudgetTracker() {
  const [actuals, setActuals] = useState<Record<string, number>>(
    Object.fromEntries(budgetCategories.map((b) => [b.category, 0]))
  );
  const { ref, isVisible } = useScrollAnimation();

  const totalEstimated = budgetCategories.reduce((s, b) => s + b.estimated, 0);
  const totalActual = Object.values(actuals).reduce((s, v) => s + v, 0);
  const spendPercent = Math.min(100, Math.round((totalActual / totalEstimated) * 100));

  return (
    <section id="budget" className="section-padding bg-muted/50">
      <div ref={ref} className="mx-auto max-w-3xl">
        <h2
          className={`font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          Budget <span className="text-gradient-sunset">Tracker</span>
        </h2>

        {/* Totals */}
        <div className={`mt-8 flex flex-wrap items-center justify-center gap-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
          <div className="text-center">
            <p className="font-body text-xs text-muted-foreground">Estimated</p>
            <p className="font-display text-2xl text-foreground">₹{totalEstimated.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="font-body text-xs text-muted-foreground">Actual</p>
            <p className={`font-display text-2xl ${totalActual > totalEstimated ? "text-destructive" : "text-accent"}`}>
              ₹{totalActual.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className={`mx-auto mt-4 max-w-md ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.25s" }}>
          <div className="h-3 overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalActual > totalEstimated ? "bg-destructive" : "bg-accent"
              }`}
              style={{ width: `${spendPercent}%` }}
            />
          </div>
          <p className="mt-1 text-right font-body text-xs text-muted-foreground">{spendPercent}% spent</p>
        </div>

        {/* Categories */}
        <div className={`mt-8 space-y-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.35s" }}>
          {budgetCategories.map((b) => (
            <div key={b.category} className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-3">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span className="flex-1 font-body text-sm font-medium text-foreground">{b.category}</span>
              <span className="font-body text-xs text-muted-foreground">Est: ₹{b.estimated.toLocaleString()}</span>
              <input
                type="number"
                placeholder="0"
                value={actuals[b.category] || ""}
                onChange={(e) =>
                  setActuals((p) => ({ ...p, [b.category]: Number(e.target.value) || 0 }))
                }
                className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
