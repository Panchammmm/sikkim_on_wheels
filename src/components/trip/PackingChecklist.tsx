import { useState, useEffect } from "react";
import { Check, Package } from "lucide-react";
import { packingList } from "@/data/tripData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const STORAGE_KEY = "sikkim-packing-checked";

export default function PackingChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (item: string) => setChecked((p) => ({ ...p, [item]: !p[item] }));

  const allItems = Object.values(packingList).flat();
  const checkedCount = allItems.filter((i) => checked[i]).length;
  const progress = Math.round((checkedCount / allItems.length) * 100);

  return (
    <section id="packing" className="section-padding bg-muted/50">
      <div ref={ref} className="mx-auto max-w-4xl">
        <h2
          className={`font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          Packing <span className="text-gradient-sunset">Checklist</span>
        </h2>

        {/* Progress bar */}
        <div className={`mx-auto mt-6 max-w-md ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between font-body text-sm text-muted-foreground">
            <span>{checkedCount} / {allItems.length} packed</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {Object.entries(packingList).map(([category, items], ci) => (
            <div
              key={category}
              className={`rounded-2xl border border-border bg-card p-5 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${0.1 * (ci + 3)}s` }}
            >
              <div className="mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg tracking-wide text-foreground">{category}</h3>
              </div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => toggle(item)}
                      className="group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left font-body text-sm transition-colors hover:bg-muted"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                          checked[item]
                            ? "border-accent bg-accent"
                            : "border-border bg-background"
                        }`}
                      >
                        {checked[item] && <Check className="h-3 w-3 text-accent-foreground" />}
                      </span>
                      <span className={checked[item] ? "text-muted-foreground line-through" : "text-foreground"}>
                        {item}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
