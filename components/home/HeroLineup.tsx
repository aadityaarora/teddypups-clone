"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/media/MediaImage";
import { prefersReducedMotion } from "@/lib/hooks";
import type { Media } from "@/lib/data/puppies";

export type Friend = { id: string; slug: string; displayName: string; breed: string; cover: Media };

// [x %, width rem, peek, tilt deg] per seat, and the pause between swaps (ms). Ported from the original HeroLineup.
const SEATS: [number, number, number, number][] = [
  [9, 8.6, 0.62, -5], [22.5, 10.4, 0.8, 3], [35, 9.2, 0.7, -2],
  [65, 9.4, 0.74, 3], [77.5, 10.6, 0.82, -3], [91, 8.4, 0.6, 4],
];
const PAUSES = [1900, 2500, 1700, 2300, 2000, 2800, 1800];
const DUCK_MS = 360; // photo ducks behind the quilt, then the next pup pops up
const POP_MS = 700;
const TAG_MS = 1800; // name tag stays up after a pop

const shuffle = <T,>(a: T[]) => {
  const t = [...a];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
};

const seatStyle = (i: number) => {
  const [x, w, peek, tilt] = SEATS[i];
  return { "--x": `${x}%`, "--w": `${w}rem`, "--peek": peek, "--tilt": `${tilt}deg`, "--i": i } as React.CSSProperties;
};

/**
 * Six pups peek over the hero quilt. With motion allowed, one seat at a time ducks and pops back
 * with a different pup (preloaded off-screen in "wings"), and its name tag flashes. Hover/focus shows the tag.
 * Pauses while the user scrolls/points, the tab is hidden or the hero is off-screen.
 */
export function HeroLineup({ friends, label }: { friends: Friend[]; label: string }) {
  const count = Math.min(SEATS.length, friends.length);
  const [seats, setSeats] = useState(() => friends.slice(0, count).map((_, i) => i)); // seat -> friend index
  const [state, setState] = useState<Record<number, "duck" | "pop" | undefined>>({});
  const [flash, setFlash] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [wings, setWings] = useState<number | null>(friends.length > count ? count : null);
  const listRef = useRef<HTMLUListElement>(null);
  const wingsRef = useRef<HTMLSpanElement>(null);
  const seatsRef = useRef(seats);
  useEffect(() => { seatsRef.current = seats; }, [seats]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !count || prefersReducedMotion()) return;
    const rotate = friends.length > count;
    const scene = list.closest<HTMLElement>("[data-pup-scene]");
    let visible = true, quietUntil = 0, alive = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.35 });
    io.observe(list);
    const busy = () => (quietUntil = performance.now() + 1200);
    addEventListener("scroll", busy, { passive: true });
    addEventListener("pointerdown", busy, { passive: true });
    list.addEventListener("pointerover", busy, { passive: true });

    const offstage = friends.map((_, i) => i).filter((i) => !seatsRef.current.includes(i));
    let queue = offstage.includes(count) ? [count, ...shuffle(offstage.filter((i) => i !== count))] : shuffle(offstage);
    let order: number[] = [];
    let last = -1, beat = 0, tries = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    // wait until it's a good moment and the next photo is decoded
    const tick = () => {
      if (document.hidden || !visible || performance.now() < quietUntil || scene?.dataset.here === "false") return later(tick, 900);
      if (!rotate) return swap();
      if (!queue.length) queue = shuffle(friends.map((_, i) => i).filter((i) => !seatsRef.current.includes(i)));
      const img = wingsRef.current?.dataset.for === String(queue[0]) ? wingsRef.current.querySelector("img") : null;
      if (!img || !img.complete || !img.naturalWidth) {
        if (++tries < 15) return later(tick, 400);
        queue.push(queue.shift()!);
        setWings(queue[0] ?? null);
        tries = 0;
        return later(tick, 800);
      }
      tries = 0;
      img.decode().then(swap, swap);
    };

    const swap = () => {
      if (!order.length) {
        order = shuffle([...list.children].map((el, i) => (el.getClientRects().length ? i : -1)).filter((i) => i >= 0))
          .filter((seat, i, a) => !(i === 0 && seat === last && a.length > 1));
      }
      const seat = order.shift();
      if (seat === undefined) return later(tick, 2000);
      last = seat;
      const incoming = rotate ? queue.shift()! : seatsRef.current[seat];
      setState((s) => ({ ...s, [seat]: "duck" }));
      later(() => {
        if (rotate) {
          const outgoing = seatsRef.current[seat];
          setSeats((s) => s.map((f, i) => (i === seat ? incoming : f)));
          queue.push(outgoing);
          setWings(queue[0] ?? null);
        }
        setState((s) => ({ ...s, [seat]: "pop" }));
        setFlash(seat);
        later(() => setFlash((f) => (f === seat ? null : f)), TAG_MS);
        later(() => setState((s) => ({ ...s, [seat]: undefined })), POP_MS);
      }, DUCK_MS);
      later(tick, PAUSES[beat++ % PAUSES.length]);
    };

    if (rotate) setWings(queue[0] ?? null);
    // start after the entrance (tp-peek) animations finish
    const peeks = [...list.querySelectorAll(".tp-lineup__pup")].flatMap((el) => el.getAnimations())
      .filter((a) => (a as CSSAnimation).animationName === "tp-peek");
    const start = () => alive && later(tick, 250);
    Promise.all(peeks.map((a) => a.finished)).then(start, start);

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      io.disconnect();
      removeEventListener("scroll", busy);
      removeEventListener("pointerdown", busy);
      list.removeEventListener("pointerover", busy);
    };
  }, [friends, count]);

  if (!count) return null;
  const leave = (i: number) => () => setHover((h) => (h === i ? null : h));

  return (
    <>
      <ul ref={listRef} className="tp-lineup" aria-label={label}>
        {seats.map((f, i) => {
          const p = friends[f];
          return (
            <li key={i} className="tp-lineup__seat" style={seatStyle(i)}>
              <Link
                href={`/puppies/${p.slug}`}
                className="tp-lineup__pup"
                data-pup-friend="true"
                data-state={state[i]}
                aria-label={`Meet ${p.displayName}, ${p.breed}`}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={leave(i)}
                onFocus={() => setHover(i)}
                onBlur={leave(i)}
              >
                <span className="tp-lineup__photo">
                  <MediaImage key={p.id} media={p.cover} sizes="11rem" priority={i < 2} loading="eager" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
        {seats.map((f, i) => (
          <li key={i} className="tp-lineup__seat" style={seatStyle(i)}>
            <span className="tp-lineup__ghost" data-state={state[i]} data-tag={flash === i || hover === i ? "show" : undefined}>
              <span className="tp-lineup__name font-scrawl">{friends[f].displayName}</span>
            </span>
          </li>
        ))}
      </ul>
      {wings !== null && (
        <span ref={wingsRef} aria-hidden="true" className="tp-lineup__wings" data-for={wings}>
          <MediaImage media={friends[wings].cover} alt="" sizes="11rem" loading="eager" />
        </span>
      )}
    </>
  );
}
