import { Phone, Shield, Heart, Wrench, MapPin, AlertTriangle } from "lucide-react";
import { emergencyContacts } from "@/data/tripData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

/* CONFIG */

const typeConfig = {
  police: { icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
  medical: { icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
  road: { icon: Wrench, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  general: { icon: Phone, color: "text-primary", bg: "bg-primary/10" },
};

/* HELPERS */

function getLocation(callback) {
  if (!navigator.geolocation) return callback(null);

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      callback(`https://maps.google.com/?q=${latitude},${longitude}`);
    },
    () => callback(null)
  );
}

/* CARD */

function ContactCard({ contact, index, isVisible }) {
  const config = typeConfig[contact.type] || typeConfig.general;
  const Icon = config.icon;

  return (
    <div
      className={`group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1
      ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-6"}`}
      style={{ animationDelay: `${0.08 * (index + 2)}s` }}
    >
      {/* Top Row */}
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.bg}`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{contact.name}</p>
          <p className="text-xs text-muted-foreground">{contact.number}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {/* Call */}
        <a
          href={`tel:${contact.number}`}
          className="flex-1 rounded-lg border border-border px-3 py-2 text-xs text-center hover:bg-muted"
        >
          📞 Call
        </a>

        {/* Map */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.name)}`}
          target="_blank"
          className="flex-1 rounded-lg border border-border px-3 py-2 text-xs text-center hover:bg-muted"
        >
          📍 Map
        </a>

        {/* SMS */}
        <button
          onClick={() => {
            getLocation((link) => {
              const msg = `Emergency! I need help. My location: ${link || "Unavailable"}`;
              window.location.href = `sms:${contact.number}?body=${encodeURIComponent(msg)}`;
            });
          }}
          className="flex-1 rounded-lg border border-border px-3 py-2 text-xs text-center hover:bg-muted"
        >
          💬 SMS
        </button>
      </div>
    </div>
  );
}

/* SOS BUTTON */

function SOSButton() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocation(setLocation);
  }, []);

  const handleSOS = () => {
    const msg = `🚨 SOS! I need urgent help. My location: ${location || "Unavailable"}`;

    // Call + SMS fallback
    window.location.href = `tel:112`;

    setTimeout(() => {
      window.location.href = `sms:112?body=${encodeURIComponent(msg)}`;
    }, 1500);
  };

  return (
    <button
      onClick={handleSOS}
      className="flex items-center gap-2 rounded-full 
      bg-red-600 px-5 py-3 text-white shadow-xl transition hover:scale-105 active:scale-95"
    >
      <AlertTriangle className="h-5 w-5" />
      SOS
    </button>
  );
}

/* MAIN */

export default function EmergencyContacts() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <>
      <section
        id="emergency"
        ref={ref}
        className="section-padding bg-background"
      >
        <div className="mx-auto max-w-3xl px-4">
          <h2
            className={`text-center font-display text-4xl tracking-wider text-foreground sm:text-5xl
            ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-6"}`}
          >
            Emergency <span className="text-gradient-sunset">Contacts</span>
          </h2>

          {/* Offline Notice */}
          {!navigator.onLine && (
            <p className="mt-4 text-center text-xs text-red-500">
              ⚠️ You are offline. Calls & SMS will still work.
            </p>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {emergencyContacts.map((contact, i) => (
              <ContactCard
                key={`${contact.name}-${i}`}
                contact={contact}
                index={i}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-10">
        <SOSButton />
      </div>
      </section>

      {/* Floating SOS */}
    </>
  );
}