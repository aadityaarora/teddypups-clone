"use client";

import Link from "next/link";
import { PupStop } from "@/components/art/PupStop";
import { pupSitSvg } from "@/components/art/pup-svgs";
import { Scene } from "@/components/home/Scene";
import { Polaroid } from "@/components/media/Polaroid";
import { usePhotoViewer } from "@/components/media/PhotoViewer";
import { RevealScope } from "@/components/media/RevealScope";
import type { HomeSection } from "@/lib/data/home";
import type { Tone } from "@/lib/data/home-copy";
import type { Media } from "@/lib/data/puppies";
import type { Testimonial } from "@/lib/data/testimonials";

const SIZES = "(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw";
// reveal stagger: print i drops in after ORDER[i] * 110ms
const ORDER = [3, 0, 5, 1, 6, 2, 7, 4];

/** "Happy families & puppies": testimonial bubble, then 8 taped polaroids on a house front at dusk */
export function Families({ section, photos, testimonial, tone }: { section: HomeSection; photos: Media[]; testimonial?: Testimonial; tone: Tone }) {
  const prints = photos.slice(0, 8);
  const { open, viewer } = usePhotoViewer(photos, SIZES);
  if (!photos.length) return null;

  return (
    <Scene tone={tone} className="tp-dusk" labelledBy="dusk-title">
      <div className="tp-dusk__sky gutter">
        <div className="tp-dusk__head">
          <h2 id="dusk-title" className="font-plush text-huge">{section.heading}</h2>
          {section.body && <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">{section.body}</p>}
        </div>
        {testimonial && (
          <figure className="tp-dusk__note">
            <blockquote className="font-plush-text">“{testimonial.quote}”</blockquote>
            <figcaption className="font-scrawl">{testimonial.author}{testimonial.location ? `, ${testimonial.location}` : ""}</figcaption>
          </figure>
        )}
      </div>
      <div className="tp-photowall">
        <RevealScope className="tp-photowall__wall">
          <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
            {prints.map((p, i) => (
              <li
                key={p.id}
                data-reveal="true"
                data-pup-look={i === 1 || i === 4 ? "" : undefined}
                style={{ "--d": `${110 * ORDER[i]}ms` } as React.CSSProperties}
              >
                <button
                  type="button"
                  className="tp-photowall__print"
                  onClick={() => open(i)}
                  aria-label={`Open photo ${i + 1} of ${photos.length}${p.caption ? `: ${p.caption}` : ""}`}
                >
                  <Polaroid media={p} order={i} sizes={SIZES} />
                </button>
              </li>
            ))}
          </ul>
          <div className="tp-facade__ground">
            <span aria-hidden="true" className="tp-facade__door" />
            <span aria-hidden="true" className="tp-lamp"><span className="tp-lamp__light" /></span>
            {section.data.ctaLabel && (
              <Link href={section.data.ctaHref ?? "/happy-families"} className="btn btn-primary tp-facade__cta">{section.data.ctaLabel}</Link>
            )}
            <PupStop svg={pupSitSvg} pose="sit" className="tp-dusk__teddy" />
          </div>
        </RevealScope>
        <div aria-hidden="true" className="tp-street__pavement" />
      </div>
      {viewer}
    </Scene>
  );
}
