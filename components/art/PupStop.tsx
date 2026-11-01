// Static (non-interactive) Teddy mascot, as server-rendered by the original before its pup-actor JS takes over.
// `behind`/`lane` matter: on phones with motion enabled, CSS hides stops without data-lane.
export function PupStop({
  svg,
  pose,
  className,
  label,
  act,
  behind,
  lane,
}: {
  svg: string;
  pose: "sit" | "peek" | "snug" | "bow";
  className: string;
  /** Accessible name; decorative (aria-hidden) when omitted */
  label?: string;
  act?: string;
  behind?: boolean;
  lane?: boolean;
}) {
  return (
    <div
      data-pup-stop="true"
      data-pose={pose}
      data-facing="right"
      data-act={act}
      data-behind={behind || undefined}
      data-lane={lane || undefined}
      className={`pup-stop ${className}`}
    >
      <div className="pup-buddy" data-facing="right">
        <svg
          viewBox="0 0 300 240"
          style={{ overflow: "visible" }}
          {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
          focusable="false"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <span aria-hidden="true" className="pup-bubble" data-show="false" />
      </div>
    </div>
  );
}
