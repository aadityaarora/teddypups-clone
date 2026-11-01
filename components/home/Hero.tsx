import Link from "next/link";
import { PupStop } from "@/components/art/PupStop";
import { pupPeekSvg } from "@/components/art/pup-svgs";
import { MediaImage } from "@/components/media/MediaImage";
import { availablePuppies } from "@/lib/data/puppies";
import { hero, site } from "@/lib/data/site";

// Seat geometry per lineup slot (recon/html/home.html inline styles)
const SEATS = [
  { x: "9%", w: "8.6rem", peek: 0.62, tilt: "-5deg" },
  { x: "22.5%", w: "10.4rem", peek: 0.8, tilt: "3deg" },
  { x: "35%", w: "9.2rem", peek: 0.7, tilt: "-2deg" },
  { x: "65%", w: "9.4rem", peek: 0.74, tilt: "3deg" },
  { x: "77.5%", w: "10.6rem", peek: 0.82, tilt: "-3deg" },
  { x: "91%", w: "8.4rem", peek: 0.6, tilt: "4deg" },
];

const seatStyle = (i: number) => {
  const s = SEATS[i];
  return { "--x": s.x, "--w": s.w, "--peek": s.peek, "--tilt": s.tilt, "--i": i } as React.CSSProperties;
};

export function Hero() {
  const lineup = availablePuppies.slice(0, SEATS.length);
  // The 7th pup's photo is preloaded off-screen ("wings") for when the lineup rotates
  const wings = availablePuppies[SEATS.length]?.images[0];

  return (
    <section
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-hero"
      style={{ "--sky-top": "#fffdf8", "--sky-bottom": "#fff1d8", "--quilt": "#fff1d8" } as React.CSSProperties}
      aria-labelledby="hero-title"
    >
      <span aria-hidden="true" className="tp-hero__sun" />
      <div className="tp-hero__copy gutter">
        <p className="tp-hero__note font-scrawl">
          {hero.note}
          <svg viewBox="0 0 220 24" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-toffee" aria-hidden="true">
            <path d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
        <h1 id="hero-title" className="tp-hero__title font-plush">
          <span className="tp-hero__line">{hero.titleLines[0]}</span>
          <span className="tp-hero__line tp-hero__line--2">{hero.titleLines[1]}</span>
        </h1>
        <p className="tp-hero__lede">{hero.lede}</p>
        <div className="tp-hero__actions">
          <Link className="btn btn-primary" href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
          <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{hero.secondaryCta}</a>
        </div>
      </div>

      <div className="tp-hero__stage">
        <ul className="tp-lineup" aria-label={hero.lineupLabel}>
          {lineup.map((p, i) => (
            <li key={p.slug} className="tp-lineup__seat" style={seatStyle(i)}>
              <Link className="tp-lineup__pup" data-pup-friend="true" aria-label={`Meet ${p.displayName}, ${p.breed}`} href={`/puppies/${p.slug}`}>
                <span className="tp-lineup__photo">
                  <MediaImage media={p.images[0]} sizes="11rem" priority={i < 2} loading="eager" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
          {lineup.map((p, i) => (
            <li key={p.slug} className="tp-lineup__seat" style={seatStyle(i)}>
              <span className="tp-lineup__ghost">
                <span className="tp-lineup__name font-scrawl">{p.displayName}</span>
              </span>
            </li>
          ))}
        </ul>
        {wings && (
          <span aria-hidden="true" className="tp-lineup__wings" data-for={SEATS.length}>
            <MediaImage media={wings} alt="" sizes="11rem" loading="eager" />
          </span>
        )}
        <PupStop svg={pupPeekSvg} label={hero.teddyLabel} pose="peek" act="peekaboo" className="tp-hero__teddy" />
        <div aria-hidden="true" className="tp-quilt">
          <svg className="tp-quilt__edge" width="100%" height="40" preserveAspectRatio="none">
            <defs>
              <pattern id="tp-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40V27A38 25 0 0 1 76 27V40Z" style={{ fill: "var(--quilt)" }} />
                <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
                <path d="M11 33A27 19 0 0 1 65 33" fill="none" stroke="#2a170e" strokeWidth="1.6" strokeDasharray="3.5 5.5" strokeLinecap="round" opacity=".42" />
              </pattern>
            </defs>
            <rect width="100%" height="40" fill="url(#tp-scallop)" />
          </svg>
        </div>
      </div>
    </section>
  );
}
