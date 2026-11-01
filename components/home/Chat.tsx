"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PupStop } from "@/components/art/PupStop";
import { pupSitSvg } from "@/components/art/pup-svgs";
import { Scene } from "@/components/home/Scene";
import { PAW_PATH } from "@/components/icons/Paw";
import { MediaImage } from "@/components/media/MediaImage";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";
import type { HomeSection } from "@/lib/data/home";
import type { Tone } from "@/lib/data/home-copy";
import type { Media } from "@/lib/data/puppies";

/** Muted looping clip with its own play/pause button (loads nothing until played) */
function Clip({ media }: { media: Media }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else { v.pause(); setPlaying(false); }
  };
  return (
    <div className="tp-msg tp-msg--them tp-msg--media">
      <div className="tp-clip">
        <video ref={ref} src={media.url} poster={media.poster?.url} muted loop playsInline preload="none" aria-label={media.alt || "A puppy video"} onEnded={() => setPlaying(false)} />
        <button type="button" className="tp-clip__play" onClick={toggle} aria-pressed={playing} aria-label={playing ? "Pause video" : "Play video"}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={playing ? "M7 5h3v14H7zM14 5h3v14h-3z" : "M8 5v14l11-7z"} />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * "Your puppy journey". Steps on the left, a WhatsApp phone on the right.
 * Desktop with motion: the phone is sticky and each step that crosses the upper third of the viewport
 * becomes active; the phone shows "typing…" for 750ms, then that step's messages pop in.
 * Otherwise every message is shown and the last step is active.
 */
export function Chat({
  section, tone, business, greeting, whatsappHref, breeds,
}: {
  section: HomeSection;
  tone: Tone;
  business: string;
  greeting: string;
  whatsappHref: string;
  breeds: { slug: string; name: string }[];
}) {
  const items = section.data.items ?? [];
  const photos = section.media.filter((m) => m.kind === "image").slice(0, 4);
  const video = section.media.find((m) => m.kind === "video");
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  const still = reduced || !desktop;
  const [step, setStep] = useState(-1);
  const [typing, setTyping] = useState(false);
  const stepsRef = useRef<HTMLOListElement>(null);
  const prev = useRef(-1);
  const active = still ? items.length - 1 : step;

  useEffect(() => {
    if (still || !stepsRef.current) return;
    const lis = [...stepsRef.current.children];
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setStep(lis.indexOf(e.target));
    }, { rootMargin: "-28% 0px -62% 0px" });
    lis.forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, [still, items.length]);

  useEffect(() => {
    if (still) return;
    const forward = step > prev.current;
    prev.current = step;
    if (!forward || step < 0) return;
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 750);
    return () => clearTimeout(t);
  }, [step, still]);

  return (
    <Scene tone={tone} className="tp-chat" labelledBy="journey-title">
      <div className="tp-chat__grid gutter" data-pin-range="true">
        <div className="tp-chat__story">
          <h2 id="journey-title" className="font-plush text-huge">{section.heading}</h2>
          {section.body && <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">{section.body}</p>}
          <ol ref={stepsRef} className="tp-chat__steps">
            {items.map((it, i) => (
              <li key={it.title} className="tp-chat__step" data-active={i === active || undefined} data-done={i < active || undefined}>
                <span className="tp-chat__num font-plush" aria-hidden="true">{i + 1}</span>
                <h3 className="font-plush tp-chat__title">{it.title}</h3>
                <p className="tp-chat__text">{it.text}</p>
              </li>
            ))}
          </ol>
          {section.data.ctaLabel && (
            <Link href={section.data.ctaHref ?? "/how-it-works"} className="btn btn-ghost tp-chat__cta">{section.data.ctaLabel}</Link>
          )}
        </div>

        <div className="tp-chat__side">
          <div className="tp-phone" aria-label={`A WhatsApp conversation with ${business}`} role="group">
            <div className="tp-phone__bar">
              <Image src="/brand/logo.png" alt="" width={40} height={40} className="tp-phone__avatar" />
              <span>
                <span className="tp-phone__name">{business}</span>
                <span className="tp-phone__status">{typing ? "typing…" : "online"}</span>
              </span>
            </div>
            <div className="tp-phone__screen">
              <p className="tp-msg tp-msg--me">{greeting}</p>
              {items.map((it, i) => (
                <div key={it.title} className="tp-msg-group" data-step={i} data-show={i < active || (i === active && !typing) ? "true" : "false"}>
                  {i === 0 && breeds.length > 0 && (
                    <div className="tp-msg tp-msg--them">
                      <p>{it.text}</p>
                      <ul className="tp-chips" aria-label="Breeds we have now">
                        {breeds.slice(0, 6).map((b) => (
                          <li key={b.slug}><Link href={`/puppies?breed=${b.slug}`}>{b.name}</Link></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {i === 1 && (
                    <>
                      {photos.length > 0 && (
                        <div className="tp-msg tp-msg--them tp-msg--media">
                          <div className="tp-snaps">
                            {photos.map((m) => (
                              <span key={m.id} className="tp-snaps__one"><MediaImage media={m} sizes="9rem" /></span>
                            ))}
                          </div>
                        </div>
                      )}
                      {video && <Clip media={video} />}
                      <p className="tp-msg tp-msg--them">{it.text}</p>
                    </>
                  )}
                  {i === 2 && (
                    <div className="tp-msg tp-msg--them">
                      <p>{it.text}</p>
                      <svg viewBox="0 0 220 70" className="tp-route" aria-hidden="true">
                        <path d="M14 52 C 60 6, 120 70, 170 28" className="tp-route__line" />
                        <circle cx="14" cy="52" r="5" className="tp-route__dot" />
                        <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="tp-route__home" />
                        <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" className="tp-route__heart" />
                        <path d={PAW_PATH} transform="translate(70 22) scale(.3) rotate(70 32 32)" className="tp-route__paw" />
                        <path d={PAW_PATH} transform="translate(104 38) scale(.3) rotate(100 32 32)" className="tp-route__paw" />
                      </svg>
                    </div>
                  )}
                  {i > 2 && <p className="tp-msg tp-msg--them">{it.text}</p>}
                  {i === 0 && breeds.length === 0 && <p className="tp-msg tp-msg--them">{it.text}</p>}
                </div>
              ))}
              <p className="tp-typing" data-show={typing ? "true" : "false"} aria-hidden="true"><span /><span /><span /></p>
            </div>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="tp-phone__compose">
              <span>Say hello on WhatsApp</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20l18-8L3 4v6l12 2-12 2z" /></svg>
            </a>
          </div>
          <PupStop svg={pupSitSvg} pose="sit" className="tp-chat__teddy" />
        </div>
      </div>
    </Scene>
  );
}
