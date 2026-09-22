import { Children } from "react";

export default function InfiniteMarquee({ children, speed = 40, gap = 20 }) {
  const items = Children.toArray(children);

  return (
    <div className="w-full overflow-hidden">
      <div
        className="marquee-track flex"
        style={{
          gap: `${gap}px`,
          "--marquee-duration": `${speed}s`,
        }}
      >
        {items.map((child, index) => (
          <div key={`a-${index}`} className="shrink-0">
            {child}
          </div>
        ))}
        {items.map((child, index) => (
          <div key={`b-${index}`} className="shrink-0" aria-hidden>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
