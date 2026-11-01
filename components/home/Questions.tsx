import Link from "next/link";
import { PupStop } from "@/components/art/PupStop";
import { pupSitSvg } from "@/components/art/pup-svgs";
import { STAR_PATH, Stars } from "@/components/art/Stars";
import { Scene } from "@/components/home/Scene";
import { faqs } from "@/lib/data/faqs";
import { questions } from "@/lib/data/home-copy";

// [left %, top %, width px] from recon
const STARS: [number, number, number][] = [
  [8, 12, 16.2], [22, 30, 9], [41, 8, 12.6], [57, 22, 8.1], [72, 6, 14.4], [88, 18, 10.8],
  [95, 42, 9], [4, 58, 10.8], [34, 70, 7.2], [63, 84, 9.9], [83, 66, 12.6],
];

/** "Questions, answered": night sky, the first FAQs as a list, and a puzzled Teddy under a big "?" */
export function Questions() {
  return (
    <Scene tone={questions.tone} className="tp-night" labelledBy="questions-title">
      <Stars stars={STARS} className="pointer-events-none tp-night__stars" />
      <div className="tp-night__grid gutter">
        <div className="tp-night__intro">
          <h2 id="questions-title" className="font-plush text-huge">{questions.heading}</h2>
          <Link className="btn btn-ghost tp-night__cta" href={questions.cta.href}>{questions.cta.label}</Link>
          <div className="tp-night__pup">
            <span aria-hidden="true" className="tp-night__wonder font-plush">?</span>
            <PupStop svg={pupSitSvg} pose="sit" act="tilt" className="tp-night__teddy" />
          </div>
        </div>
        <dl className="tp-night__list">
          {faqs.slice(0, questions.count).map((f, i) => (
            // Teddy glances at the first two answers
            <div key={f.id} className="tp-qa" data-pup-look={i < 2 ? "" : undefined}>
              <dt className="font-plush tp-qa__q">
                <svg viewBox="0 0 40 40" className="tp-qa__star" aria-hidden="true"><path d={STAR_PATH} fill="currentColor" /></svg>
                {f.question}
              </dt>
              <dd className="tp-qa__a">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Scene>
  );
}
