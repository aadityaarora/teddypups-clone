// Copy for the server-rendered home sections, verbatim from recon/html/home.html.
// (Sections the original renders client-side are generated into ./home.ts.)
import { site } from "./site";

/** Section sky gradient + ink tone (see .tp-scene) */
export type Tone = { top: string; bottom: string; dark?: boolean };

/** Sky gradient per section, top to bottom of the page */
export const tones = {
  meet: { top: "#fff1d8", bottom: "#fbe3b4" },
  paths: { top: "#fbe3b4", bottom: "#f7d18d" },
  journey: { top: "#f7d18d", bottom: "#f0b866" },
  trust: { top: "#f0b866", bottom: "#a65a30" },
  families: { top: "#a65a30", bottom: "#4d2b19", dark: true },
  questions: { top: "#4d2b19", bottom: "#2f1a10", dark: true },
  cta: { top: "#2f1a10", bottom: "#24130b", dark: true },
} satisfies Record<string, Tone>;

export const paths = {
  tone: tones.paths,
  heading: "Two ways to meet your puppy",
  local: {
    sign: "Puppies in Dubai",
    caption: "In our showroom",
    text: "See them, love them, take them home. Come meet our locally available puppies before you decide.",
    cta: { href: "/puppies?origin=local", label: "Meet local puppies" },
  },
  imported: {
    sign: "Imported for you",
    text: "Exclusive Korean teacup puppies, delivered. Order from the world's most reputable breeders and let us handle the import.",
    cta: { href: "/puppies?origin=imported", label: "See imported puppies" },
    /** pup whose photo sits in the plane's porthole */
    flightPup: "korean-teacup-maltipoo-female",
    flightLabel: "A plane bringing a Korean Teacup Maltipoo puppy from Korea to Dubai",
  },
};

export type Stamp = {
  shape: "round" | "ticket" | "oval" | "scallop";
  ink: string;
  tilt: string;
  title: string;
  text: string;
  /** icon drawing; `dash`/`width` override stroke on that path */
  icon: { d?: string; circle?: [number, number, number]; dash?: string; width?: number }[];
};

export const trust = {
  tone: tones.trust,
  kicker: "puppy passport",
  heading: "Why families trust TeddyPups",
  stamps: [
    {
      shape: "round", ink: "#a24a1a", tilt: "-8deg",
      title: "Vet-checked & healthy",
      text: "Every puppy comes vaccinated, dewormed, and with a verified health certificate.",
      icon: [
        { d: "M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z" },
        { d: "M22 30h7l3-7 4 13 3-6h7" },
      ],
    },
    {
      shape: "ticket", ink: "#1f6b45", tilt: "5deg",
      title: "Korea to Dubai, safely",
      text: "Trusted breeders, safe travel, and premium care from start to finish.",
      icon: [
        { d: "M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z" },
        { d: "M8 50c10 4 20 4 30 0", dash: "2 7" },
      ],
    },
    {
      shape: "oval", ink: "#5a3a28", tilt: "-4deg",
      title: "Support 24/7",
      text: "Always here to help, from choosing your puppy to post-delivery support.",
      icon: [
        { d: "M10 14h44v28H30l-12 10v-10h-8z" },
        { d: "M22 28h0M32 28h0M42 28h0", width: 5 },
      ],
    },
    {
      shape: "scallop", ink: "#c2622b", tilt: "7deg",
      title: "Trusted by families worldwide",
      text: "Puppies delivered to loving homes all around the world.",
      icon: [
        { circle: [32, 32, 22] },
        { d: "M10 32h44M32 10c-8 8-8 36 0 44M32 10c8 8 8 36 0 44" },
      ],
    },
  ] satisfies Stamp[],
};

export const questions = {
  tone: tones.questions,
  heading: "Questions, answered",
  cta: { href: "/faq", label: "Read all questions" },
  /** how many FAQs (from the top of lib/data/faqs.ts) the home page shows */
  count: 3,
};

export const cta = {
  tone: tones.cta,
  heading: "Ready to meet your new best friend?",
  lede: "Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.",
  /** pup waiting inside the door */
  insidePup: "maltipoo-max-male",
  insideAlt: "Max, waiting inside",
  mat: "welcome home",
  whatsapp: { href: site.whatsapp.href, label: "Enquire on WhatsApp" },
  contact: { href: "/contact", label: "Visit & contact" },
};
