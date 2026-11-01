import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree, Shantell_Sans } from "next/font/google";
import { PawTrail } from "@/components/cursor/PawTrail";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppBar } from "@/components/layout/WhatsAppBar";
import "./globals.css";

// Variable axes are needed for font-plush ("SOFT", "WONK", "opsz") and font-scrawl ("INFM", "BNCE")
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["SOFT", "WONK", "opsz"] });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const shantell = Shantell_Sans({ subsets: ["latin"], variable: "--font-shantell", display: "swap", axes: ["BNCE", "INFM"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "TeddyPups U.A.E. — Premium teacup puppies in Dubai",
    template: "%s | TeddyPups U.A.E.",
  },
  description:
    "Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders.",
  applicationName: "TeddyPups U.A.E.",
  openGraph: { images: ["/brand/logo.png"], locale: "en_AE", siteName: "TeddyPups U.A.E.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#fffdf8", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable} ${shantell.variable}`}>
      <body suppressHydrationWarning>
        <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
          {children}
        </main>
        <Footer />
        <WhatsAppBar />
        <PawTrail />
      </body>
    </html>
  );
}
