import { useState, useEffect } from "react";

const useScrollAnimation = () => {
  // FIX: Add proper type
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((el) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id;

              if (!id) return;

              setIsVisible((prev) => ({
                ...prev,
                [id]: true,
              }));
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return isVisible;
};

export default useScrollAnimation;
