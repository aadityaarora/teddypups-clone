import { MediaImage } from "@/components/media/MediaImage";
import type { Media } from "@/lib/data/puppies";

// Tilt, tape position and tape colour cycle by position, as on the reference
const TILTS = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2];
const TAPES = ["center", "left", "right", "corners", "center", "right", "left", "center"] as const;
const TAPE_COLOURS = ["#f6d79a", "#f9cdbf", "#cfe5f6", "#f6d79a", "#e9dcc4"];

/** Taped instant photo with a handwritten caption */
export function Polaroid({ media, order, sizes, caption, priority }: { media: Media; order: number; sizes: string; caption?: string; priority?: boolean }) {
  const tape = TAPES[order % TAPES.length];
  return (
    <span
      className="tp-polaroid"
      style={{ "--tilt": `${TILTS[order % TILTS.length]}deg`, "--tape": TAPE_COLOURS[order % TAPE_COLOURS.length], "--i": order } as React.CSSProperties}
    >
      {tape === "corners" ? (
        <>
          <span aria-hidden="true" className="tp-tape tp-tape--tl" />
          <span aria-hidden="true" className="tp-tape tp-tape--tr" />
        </>
      ) : (
        <span aria-hidden="true" className={`tp-tape tp-tape--${tape}`} />
      )}
      <span className="tp-polaroid__photo">
        <MediaImage media={media} layout="natural" sizes={sizes} priority={priority} />
      </span>
      <span className="tp-polaroid__caption font-scrawl">{caption ?? media.caption}</span>
    </span>
  );
}
