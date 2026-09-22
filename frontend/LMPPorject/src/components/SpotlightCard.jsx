import { useRef, useState } from "react";

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.22)",
}) => {
  const divRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative box-border w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 p-8 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-500 ease-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-[1] flex w-full flex-col items-start text-left p-4">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
