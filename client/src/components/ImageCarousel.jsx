import { useState, useEffect } from "react";

export default function ImageCarousel({ images, alt }) {
  const [index, setIndex] = useState(0);
  const list = images?.length ? images : ["/placeholder-boarding.jpg"];

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 4000);
    return () => clearInterval(t);
  }, [list.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-200 shadow-inner ring-1 ring-slate-200/80">
      <div className="aspect-[16/10] w-full">
        {list.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={`${alt || "Boarding"} ${i + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {list.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
