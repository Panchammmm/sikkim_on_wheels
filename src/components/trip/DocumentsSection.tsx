import { FileText, Bike } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

/* DATA */
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

/* REUSABLE CARD */
function ChecklistCard({
  icon: Icon,
  title,
  items,
  accentColor = "bg-primary",
  animationClass,
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 
      transition-all duration-700 ease-out 
      hover:shadow-lg hover:-translate-y-1
      ${animationClass}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${accentColor.replace("bg-", "text-")}`} />
        <h3 className="font-display text-xl tracking-wide text-foreground">
          {title}
        </h3>
      </div>

      {/* List */}
      <ul role="list" aria-label={title} className="space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 font-body text-sm text-muted-foreground"
          >
            <span
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accentColor}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* MAIN SECTION */
export default function DocumentsSection() {
  const { ref, isVisible } = useScrollAnimation();

  // Prevent animation re-trigger
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible) setHasAnimated(true);
  }, [isVisible]);

  return (
    <section
      ref={ref}
      aria-labelledby="documents-section-heading"
      className="pt-12 pb-20 sm:pb-28 bg-background overflow-x-hidden"
    >
      <div className="mx-auto max-w-5xl px-4">
        {/* Heading */}
        <h2
          id="documents-section-heading"
          className="mb-10 text-center font-display text-2xl tracking-wide text-foreground"
        >
          Trip Essentials Checklist
        </h2>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2">

          {/* Documents */}
          <ChecklistCard
            icon={FileText}
            title="Documents Required"
            items={documents}
            accentColor="bg-primary"
            animationClass={
              hasAnimated
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-6"
            }
          />

          {/* Bike */}
          <ChecklistCard
            icon={Bike}
            title="Bike Preparation"
            items={bikeChecklist}
            accentColor="bg-accent"
            animationClass={
              hasAnimated
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-6"
            }
          />
        </div>
      </div>
    </section>
  );
}