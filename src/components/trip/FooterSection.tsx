import { Heart } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="border-t border-border bg-card px-4 py-10 text-center">
      <p className="font-display text-2xl tracking-wider text-foreground">
        SIKKIM <span className="text-gradient-sunset">RIDE 2026</span>
      </p>
      <p className="mt-2 flex items-center justify-center gap-1 font-body text-sm text-muted-foreground">
        Made with <Heart className="h-4 w-4 fill-primary text-primary" /> for the open road
      </p>
      <p className="mt-4 font-body text-xs text-muted-foreground">
        May 15 – 19, 2026 · West Sikkim, India
      </p>
    </footer>
  );
}
