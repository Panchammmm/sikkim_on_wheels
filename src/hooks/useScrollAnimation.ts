import { useEffect, useRef, useState } from "react";

export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve only this element instead of killing observer
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(element);

    // EXTRA SAFETY: handle already-visible elements
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      setIsVisible(true);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}