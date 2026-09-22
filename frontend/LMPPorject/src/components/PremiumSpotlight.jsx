import SpotlightCard from "./SpotlightCard";

export default function PremiumSpotlight({ children, className = "" }) {
  return (
    <div className="w-[300px] max-w-[min(90vw,300px)] shrink-0">
      <SpotlightCard className={className}>{children}</SpotlightCard>
    </div>
  );
}
