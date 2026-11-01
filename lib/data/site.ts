// Site-wide copy and contact details, verbatim from recon/html/home.html

export const WHATSAPP_NUMBER = "971541676733";

/** wa.me link with a prefilled message */
export const whatsappHref = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const site = {
  name: "TeddyPups U.A.E.",
  shortName: "TeddyPups",
  url: "https://puppy.instabizweb.com",
  tagline: "every puppy is family",
  description:
    "TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.",
  phone: "+971541676733",
  phoneDisplay: "+971 54 167 6733",
  email: "teddypupsadmin@gmail.com",
  address: "Downtown Dubai, United Arab Emirates",
  whatsapp: {
    number: WHATSAPP_NUMBER,
    defaultText: "Hi TeddyPups! I'd love to know more about your puppies.",
    href: whatsappHref("Hi TeddyPups! I'd love to know more about your puppies."),
  },
  logo: "/brand/logo.png",
  copyrightYear: 2026,
} as const;

/** Detail page prefill (CLAUDE.md): "Hi TeddyPups! I'm interested in {name}, the {breed}: {url}" */
export const puppyWhatsappHref = (name: string, breed: string, url: string) =>
  whatsappHref(`Hi TeddyPups! I'm interested in ${name}, the ${breed}: ${url}`);

export type NavItem = { href: string; label: string };

/** Header + mobile drawer */
export const mainNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/puppies", label: "Puppies" },
  { href: "/happy-families", label: "Happy families" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit & contact" },
];

/** Footer "Explore" column */
export const footerNav: NavItem[] = [
  { href: "/puppies", label: "Available puppies" },
  { href: "/gone-home", label: "Gone home" },
  { href: "/happy-families", label: "Happy families" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/how-it-works#delivery", label: "Delivery & collection" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit & contact" },
];

export const socials: NavItem[] = [
  { href: "https://www.instagram.com/teddypups.worldwide/", label: "Instagram" },
  { href: "https://www.tiktok.com/@teddypupsuae", label: "TikTok" },
  { href: "https://www.facebook.com/profile.php?id=61567496944539", label: "Facebook" },
];

export const footer = {
  heading: "Home, at last.",
  explore: "Explore",
  sayHello: "Say hello",
};

export const menu = {
  kicker: "where to, friend?",
  close: "Close",
  open: "Menu",
};

export const hero = {
  note: "every puppy is family",
  titleLines: ["Premium teacup", "puppies in Dubai"],
  lede: "Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.",
  primaryCta: { href: "/puppies", label: "View available puppies" },
  secondaryCta: "Enquire on WhatsApp",
  lineupLabel: "Some of the puppies in our showroom",
  teddyLabel: "Teddy, the TeddyPups puppy, peeking over the quilt",
};
