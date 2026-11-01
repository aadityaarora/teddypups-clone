import { PupStop } from "@/components/art/PupStop";
import { pupSitSvg } from "@/components/art/pup-svgs";
import { Scene } from "@/components/home/Scene";
import { trust, type Stamp } from "@/lib/data/home-copy";

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function StampIcon({ icon }: { icon: Stamp["icon"] }) {
  return (
    <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
      {icon.map((p, i) =>
        p.circle ? (
          <circle key={i} cx={p.circle[0]} cy={p.circle[1]} r={p.circle[2]} {...STROKE} />
        ) : (
          <path key={i} d={p.d} {...STROKE} strokeWidth={p.width ?? 3} strokeDasharray={p.dash} />
        ),
      )}
    </svg>
  );
}

/** "Why families trust TeddyPups": an open puppy passport with ink stamps, then a city skyline at sunset */
export function Trust() {
  return (
    <Scene tone={trust.tone} className="tp-passport" labelledBy="trust-title">
      <div className="gutter mx-auto max-w-[96rem]">
        <div className="tp-book">
          <div className="tp-book__page tp-book__page--left">
            <p aria-hidden="true" className="tp-book__kicker font-scrawl">{trust.kicker}</p>
            <h2 id="trust-title" className="font-plush tp-book__title">{trust.heading}</h2>
            <PupStop svg={pupSitSvg} pose="sit" className="tp-book__teddy" />
          </div>
          <ul className="tp-book__page tp-book__page--right">
            {trust.stamps.map((s, i) => (
              <li key={s.title} className="tp-entry" style={{ "--ink-stamp": s.ink, "--tilt": s.tilt, "--i": i } as React.CSSProperties}>
                <span className={`tp-stamp tp-stamp--${s.shape}`}>
                  <StampIcon icon={s.icon} />
                  <span className="tp-stamp__title font-plush">{s.title}</span>
                </span>
                <p className="tp-entry__text">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div aria-hidden="true" className="tp-horizon">
        <span className="tp-horizon__sun" />
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="tp-horizon__city">
          <path d="M0 160V118h34v-14h22v-22h30v34h18V96h26v30h22v-18h16v-30h34v40h20V70h28v56h24V98h18v-26h30v54h20v-38h26v-40l14-6 14 6v40h22v46h18V84h26v-30h22v50h24V76h36v50h20V96h18v-58h30v44h14V96h22v-30h16v22h26v-52l6-8v-24l4-6v-30l3-18 3 18v30l4 6v24l6 8v52h26v30h22V82h30v-20h24v48h20V90h28v-36h26v56h18V74h30v36h22V94h26v-24h30v62h20V102h26v20h34v38z" />
        </svg>
      </div>
    </Scene>
  );
}
