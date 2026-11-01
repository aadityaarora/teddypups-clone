// Static (non-interactive) Teddy mascot, as server-rendered by the original before its pup-actor JS takes over
export function PupStop({
  svg,
  label,
  pose,
  act,
  className,
}: {
  svg: string;
  label: string;
  pose: string;
  act: string;
  className: string;
}) {
  return (
    <div
      data-pup-stop="true"
      data-pose={pose}
      data-facing="right"
      data-act={act}
      data-behind="true"
      data-lane="true"
      className={`pup-stop ${className}`}
    >
      <div className="pup-buddy" data-facing="right">
        <svg
          viewBox="0 0 300 240"
          style={{ overflow: "visible" }}
          role="img"
          aria-label={label}
          focusable="false"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <span aria-hidden="true" className="pup-bubble" data-show="false" />
      </div>
    </div>
  );
}
