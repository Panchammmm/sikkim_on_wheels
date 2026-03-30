import { Phone, Shield, Heart, Wrench } from "lucide-react";
import { emergencyContacts } from "@/data/tripData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const typeIcon = {
  police: Shield,
  medical: Heart,
  road: Wrench,
  general: Phone,
};

export default function EmergencyContacts() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="emergency" className="section-padding bg-background">
      <div ref={ref} className="mx-auto max-w-3xl">
        <h2
          className={`font-display text-center text-4xl tracking-wider text-foreground sm:text-5xl ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          Emergency <span className="text-gradient-sunset">Contacts</span>
        </h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {emergencyContacts.map((c, i) => {
            const Icon = typeIcon[c.type as keyof typeof typeIcon] || Phone;
            return (
              <a
                key={c.name}
                href={`tel:${c.number}`}
                className={`flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.08 * (i + 2)}s` }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{c.number}</p>
                </div>
                <Phone className="h-4 w-4 text-accent" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
