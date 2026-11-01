"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { PupStop } from "@/components/art/PupStop";
import { pupSitSvg } from "@/components/art/pup-svgs";
import { Scene } from "@/components/home/Scene";
import { Paw } from "@/components/icons/Paw";
import { MediaImage } from "@/components/media/MediaImage";
import { useReducedMotion } from "@/lib/hooks";
import type { HomeSection } from "@/lib/data/home";
import type { Tone } from "@/lib/data/home-copy";
import type { Puppy } from "@/lib/data/puppies";

export type DoorPup = Pick<Puppy, "id" | "slug" | "name" | "displayName" | "breed" | "genderLabel" | "age" | "status" | "cover"> & { hasVideo: boolean };

const DOOR_COLOURS = ["#a24a1a", "#5a3a28", "#d4893f", "#b8644a", "#7a4a2e"];
const STATUS = { available: "Available", "gone-home": "Gone home" } as const;
const SIZES = "(min-width: 1024px) 15rem, 44vw";

/** One arched door: name plate, puppy photo inside, a door leaf that swings open, status tag */
function Door({ pup, index }: { pup: DoorPup; index: number }) {
  return (
    <Link href={`/puppies/${pup.slug}`} className="tp-door__link" style={{ "--door": DOOR_COLOURS[index % DOOR_COLOURS.length] } as React.CSSProperties}>
      <span className="tp-door__plate">
        <span className="font-plush tp-door__name">{pup.displayName}</span>
        <span className="tp-door__meta">
          {pup.name ? `${pup.breed}, ` : ""}
          {pup.genderLabel.toLowerCase()}
          {pup.age ? `, ${pup.age}` : ""}
          {pup.hasVideo ? ", with video" : ""}
        </span>
      </span>
      <span className="tp-door__frame">
        <span className="tp-door__room">
          <MediaImage media={pup.cover} sizes={SIZES} />
        </span>
        <span aria-hidden="true" className="tp-door__way">
          <span className="tp-door__leaf">
            <Paw className="tp-door__peephole" />
            <span className="tp-door__knob" />
          </span>
        </span>
        <span className="tp-door__tag font-scrawl">{STATUS[pup.status]}</span>
      </span>
    </Link>
  );
}

/**
 * "Meet the pups". Mobile/tablet or reduced motion: a grid of open doors.
 * Desktop with motion: the section pins for (100vh + 80% of the overflow) and the row of doors
 * slides left with a spring; doors open as they pass 36% of the viewport, the floor scrolls along.
 */
export function Meet({ section, pups, tone }: { section: HomeSection; pups: DoorPup[]; tone: Tone }) {
  const rangeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const hallRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [overflow, setOverflow] = useState(0);
  const [pinned, setPinned] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const desktop = matchMedia("(min-width: 1024px)").matches;
      setPinned(desktop && !reduced);
      const track = trackRef.current, hall = hallRef.current;
      if (hall && track && desktop && !reduced) {
        // size doors so plate + door fit between the heading and the floor
        const stage = hall.parentElement!;
        const head = stage.querySelector<HTMLElement>(".tp-meet__head");
        const plate = Math.max(64, ...[...track.querySelectorAll<HTMLElement>(".tp-door__plate")].map((p) => p.offsetHeight));
        const floor = hall.querySelector<HTMLElement>(".tp-meet__floor")?.offsetHeight ?? 0;
        const w = Math.max(128, Math.min(256, 0.15 * innerWidth, (stage.clientHeight - (head ? head.offsetTop + head.offsetHeight : 0) - floor - plate - 40) / 1.3));
        hall.style.setProperty("--door-w", `${w.toFixed(0)}px`);
      } else hall?.style.removeProperty("--door-w");
      setOverflow(track ? Math.max(0, track.scrollWidth - innerWidth) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (hallRef.current?.parentElement) ro.observe(hallRef.current.parentElement);
    addEventListener("resize", measure);
    return () => { ro.disconnect(); removeEventListener("resize", measure); };
  }, [reduced]);

  const { scrollYProgress } = useScroll({ target: rangeRef, offset: ["start start", "end end"] });
  const eased = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.35 });
  const x = useTransform(eased, [0, 1], [0, -overflow]);

  // floor parallax + open doors that have slid past 36% of the viewport
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!pinned || !track) return;
    const sync = (v: number) => {
      hallRef.current?.style.setProperty("--floor-x", `${v.toFixed(1)}px`);
      const line = 0.36 * innerWidth;
      for (const li of track.children as HTMLCollectionOf<HTMLElement>) {
        const open = li.offsetLeft + v < line;
        if ((li.dataset.open === "true") !== open) li.dataset.open = String(open);
      }
    };
    sync(x.get());
    return x.on("change", sync);
  }, [pinned, x]);

  return (
    <Scene tone={tone} className="tp-meet" labelledBy="meet-title" data-pinned={pinned || undefined}>
      <div
        ref={rangeRef}
        data-pin-range="true"
        style={{ height: pinned ? `calc(100vh + ${Math.round(0.8 * overflow)}px)` : undefined, "--pinned": +pinned } as React.CSSProperties}
      >
        <div className="tp-meet__stage">
          <header className="tp-meet__head gutter">
            <div>
              <h2 id="meet-title" className="font-plush text-huge">{section.heading}</h2>
              {section.body && <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">{section.body}</p>}
            </div>
            {section.data.ctaLabel && (
              <Link href={section.data.ctaHref ?? "/puppies"} className="btn btn-primary shrink-0">{section.data.ctaLabel}</Link>
            )}
          </header>
          <div ref={hallRef} className="tp-meet__hall">
            <motion.ol ref={trackRef} style={pinned ? { x } : undefined} className="tp-meet__track" data-treadmill="true" aria-label="Puppies looking for a family">
              {pups.map((p, i) => (
                <li key={p.id} className="tp-door" data-open={pinned ? "false" : "true"}>
                  <Door pup={p} index={i} />
                </li>
              ))}
              <li className="tp-door tp-door--all" data-open="true">
                <Link href={section.data.ctaHref ?? "/puppies"} className="tp-door__link">
                  <span className="tp-door__frame tp-door__frame--all">
                    <span className="font-plush tp-door__all">Meet them all</span>
                  </span>
                </Link>
              </li>
            </motion.ol>
            <div aria-hidden="true" className="tp-meet__floor" />
            <PupStop svg={pupSitSvg} pose="sit" act={pinned ? "treadmill" : undefined} className="tp-meet__teddy" />
          </div>
        </div>
      </div>
    </Scene>
  );
}
