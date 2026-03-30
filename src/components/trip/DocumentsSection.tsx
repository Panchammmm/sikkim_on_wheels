import { FileText, Bike } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const documents = [
  "Valid Driving License (original)",
  "Vehicle Registration Certificate (RC)",
  "Vehicle Insurance papers",
  "Inner Line Permit (ILP) for Sikkim",
  "Photo ID (Aadhaar / Passport)",
  "Passport-size photos (4 copies)",
  "Hotel booking confirmations",
];

const bikeChecklist = [
  "Full engine oil & filter change",
  "Brake pads inspection & replacement",
  "Chain cleaning & lubrication",
  "Tire pressure check & tread inspection",
  "Headlight, taillight & indicators check",
  "Clutch & throttle cable inspection",
  "Coolant level top-up",
  "Spare key, fuse set, spark plug",
];

export default function DocumentsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-padding bg-muted/50">
      <div ref={ref} className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        <div
          className={`rounded-2xl border border-border bg-card p-6 ${
            isVisible ? "animate-slide-in-left" : "opacity-0"
          }`}
        >
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-display text-xl tracking-wide text-foreground">Documents Required</h3>
          </div>
          <ul className="space-y-2">
            {documents.map((d) => (
              <li key={d} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`rounded-2xl border border-border bg-card p-6 ${
            isVisible ? "animate-slide-in-right" : "opacity-0"
          }`}
        >
          <div className="mb-4 flex items-center gap-2">
            <Bike className="h-5 w-5 text-primary" />
            <h3 className="font-display text-xl tracking-wide text-foreground">Bike Preparation</h3>
          </div>
          <ul className="space-y-2">
            {bikeChecklist.map((d) => (
              <li key={d} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
