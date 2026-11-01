import Link from "next/link";
import { PupStop } from "@/components/art/PupStop";
import { pupSitSvg } from "@/components/art/pup-svgs";
import { Flight } from "@/components/home/Flight";
import { Scene } from "@/components/home/Scene";
import { MediaImage } from "@/components/media/MediaImage";
import { paths } from "@/lib/data/home-copy";
import { getPuppy } from "@/lib/data/puppies";
import { homeSections } from "@/lib/data/home";

/** "Two ways to meet your puppy": a signpost between the Dubai showroom and imports from Korea */
export function Paths() {
  const showroom = homeSections.journey.media[0];
  // porthole photo: same pup and next/image URL (w=128) as the reference
  const flyer = getPuppy(paths.imported.flightPup)?.cover;
  const porthole = flyer && `/_next/image?url=${encodeURIComponent(flyer.url)}&w=128&q=75`;

  return (
    <Scene tone={paths.tone} className="tp-paths" labelledBy="paths-title">
      <div className="gutter mx-auto max-w-[110rem]">
        <h2 id="paths-title" className="tp-paths__title font-plush text-huge">{paths.heading}</h2>
        <div className="tp-fork">
          <div aria-hidden="true" className="tp-fork__post" />

          <article className="tp-way tp-way--left" aria-labelledby="way-local">
            <h3 id="way-local" className="tp-sign tp-sign--left font-plush">{paths.local.sign}</h3>
            <div className="tp-way__scene" data-pup-look="true">
              <svg viewBox="0 0 300 120" className="tp-way__skyline" aria-hidden="true">
                <path d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <figure className="tp-window">
                <span className="tp-window__glass">
                  <MediaImage media={showroom} sizes="(min-width: 1024px) 16rem, 60vw" />
                </span>
                <figcaption className="font-scrawl">{paths.local.caption}</figcaption>
              </figure>
            </div>
            <p className="tp-way__text">{paths.local.text}</p>
            <Link className="btn btn-primary" href={paths.local.cta.href}>{paths.local.cta.label}</Link>
          </article>

          <article className="tp-way tp-way--right" aria-labelledby="way-imported">
            <h3 id="way-imported" className="tp-sign tp-sign--right font-plush">{paths.imported.sign}</h3>
            <div className="tp-way__scene" data-pup-look="true">
              <Flight photo={porthole} label={paths.imported.flightLabel} />
            </div>
            <p className="tp-way__text">{paths.imported.text}</p>
            <Link className="btn btn-primary" href={paths.imported.cta.href}>{paths.imported.cta.label}</Link>
          </article>

          <PupStop svg={pupSitSvg} pose="sit" className="tp-fork__teddy" />
        </div>
      </div>
    </Scene>
  );
}
