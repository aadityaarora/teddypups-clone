export const STAR_PATH = "M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z";

/** Twinkling four-point stars at [left %, top %, width px]; each starts 0.4s after the previous */
export function Stars({ stars, className }: { stars: [number, number, number][]; className: string }) {
  return (
    <div aria-hidden="true" className={className}>
      {stars.map(([left, top, width], i) => (
        <svg
          key={i}
          viewBox="0 0 40 40"
          className="tp-twinkle absolute text-honey"
          style={{ left: `${left}%`, top: `${top}%`, width: `${width}px`, animationDelay: `${(i * 0.4).toFixed(2)}s` }}
          aria-hidden="true"
        >
          <path d={STAR_PATH} fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
