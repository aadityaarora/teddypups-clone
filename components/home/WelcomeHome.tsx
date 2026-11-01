import Link from "next/link";
import { PupStop } from "@/components/art/PupStop";
import { pupBowSvg } from "@/components/art/pup-svgs";
import { Scene } from "@/components/home/Scene";
import { MediaImage } from "@/components/media/MediaImage";
import { cta } from "@/lib/data/home-copy";
import { getPuppy } from "@/lib/data/puppies";

/** Final CTA: a little house whose door swings open on a puppy, with Teddy bowing on the mat */
export function WelcomeHome() {
  const inside = getPuppy(cta.insidePup)?.cover;
  return (
    <Scene tone={cta.tone} className="tp-home" labelledBy="cta-title">
      <div className="tp-home__copy gutter">
        <h2 id="cta-title" className="font-plush text-huge">{cta.heading}</h2>
        <p className="tp-home__lede">{cta.lede}</p>
      </div>
      <div className="tp-house">
        <span aria-hidden="true" className="tp-house__plant tp-house__plant--left" />
        <span aria-hidden="true" className="tp-house__lamp" />
        <div className="tp-house__doorway">
          <span className="tp-house__inside">
            {inside && <MediaImage media={inside} alt={cta.insideAlt} sizes="16rem" />}
          </span>
          <span aria-hidden="true" className="tp-house__door">
            <span className="tp-house__peep" />
            <span className="tp-house__knob" />
          </span>
        </div>
        <span aria-hidden="true" className="tp-house__plant tp-house__plant--right" />
        <span aria-hidden="true" className="tp-house__mat font-scrawl">{cta.mat}</span>
        <PupStop svg={pupBowSvg} pose="bow" className="tp-house__teddy" />
      </div>
      <div className="tp-home__actions gutter">
        <a href={cta.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">{cta.whatsapp.label}</a>
        <Link className="btn btn-ghost tp-home__ghost" href={cta.contact.href}>{cta.contact.label}</Link>
      </div>
    </Scene>
  );
}
