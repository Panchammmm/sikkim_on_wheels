import { Heart, MapPin, Calendar } from "lucide-react";
import PageLogo from "../../../logo.jpg";

export default function FooterSection() {
  return (
    <footer className="relative border-t border-border bg-card px-4 py-12">
      <div className="mx-auto max-w-5xl text-center">
        
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <img
            src={PageLogo}
            alt="Sikkim on Wheels Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl tracking-wider text-foreground">
          SIKKIM ON{" "}
          <span className="text-gradient-sunset">WHEELS 2026</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          Crafted with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by{" "}
          <span className="text-gradient-sunset">Pancham Sardar</span>
        </p>

        {/* Trip Info */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            June 18 – 23, 2026
          </span>

          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            West Sikkim, India
          </span>
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-border" />

        {/* Bottom Note */}
        <p className="text-[10px] text-muted-foreground">
          © 2026 Sikkim on Wheels · Built for adventure 🏍️🚩
        </p>
      </div>
    </footer>
  );
}