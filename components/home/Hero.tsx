import Link from "next/link";
import { PupStop } from "@/components/art/PupStop";
import { pupPeekSvg } from "@/components/art/pup-svgs";
import { HeroLineup, type Friend } from "@/components/home/HeroLineup";
import { availablePuppies } from "@/lib/data/puppies";
import { hero, site } from "@/lib/data/site";

export function Hero() {
  // Only what the client lineup needs, not the whole puppy record
  const friends: Friend[] = availablePuppies.map(({ id, slug, displayName, breed, cover }) => ({ id, slug, displayName, breed, cover }));

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
        <HeroLineup friends={friends} label={hero.lineupLabel} />
        <PupStop svg={pupPeekSvg} label={hero.teddyLabel} pose="peek" act="peekaboo" behind lane className="tp-hero__teddy" />
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
