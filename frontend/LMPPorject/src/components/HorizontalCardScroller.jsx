import { Children, useRef } from "react";

export default function HorizontalCardScroller({ children, gap = 20 }) {
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: trackRef.current.scrollLeft,
    };
    trackRef.current.setPointerCapture(e.pointerId);
    trackRef.current.style.cursor = "grabbing";
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    trackRef.current.scrollLeft = drag.current.scrollLeft - dx;
  };

  const endDrag = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    trackRef.current.releasePointerCapture(e.pointerId);
    trackRef.current.style.cursor = "grab";
  };

  const onWheel = (e) => {
    if (!trackRef.current) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    trackRef.current.scrollLeft += e.deltaY;
    e.preventDefault();
  };

  return (
    <div
      ref={trackRef}
      className="card-scroller -mx-2 flex cursor-grab gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-2 pb-4 pt-1"
      style={{ gap: `${gap}px` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
      onWheel={onWheel}
    >
      {Children.map(children, (child, index) => (
        <div key={index}>{child}</div>
      ))}
    </div>
  );
}
