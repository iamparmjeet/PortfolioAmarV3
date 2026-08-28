import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";
import { AmarChat } from "@/components/chat/AmarChat";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { brand, HeroImg, socialLinks } from "@/lib/data";
import "./globals.css";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: brand.full,
  jobTitle: "Video Editor, Filmmaker & Teacher",
  email: brand.email,
  url: "https://amarjeetmishra.com",
  image: HeroImg,
  address: { "@type": "PostalAddress", addressLocality: "Ludhiana", addressRegion: "Punjab" },
  sameAs: socialLinks.map((link) => link.url),
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dm-sans",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const description =
  "Filmmaker, video editor & teacher based in Ludhiana, Punjab. Brand films, Instagram reels, podcasts and visual stories that people actually watch.";

export const metadata: Metadata = {
  title: {
    default: `${brand.full} — ${brand.tagline}`,
    template: `%s — ${brand.full}`,
  },
  description,
  metadataBase: new URL("https://amarjeetmishra.com"),
  openGraph: {
    type: "website",
    siteName: "Amar Editz",
    title: `${brand.full} — ${brand.tagline}`,
    description,
    images: [{ url: HeroImg, width: 1200, height: 1500, alt: `${brand.full} on set` }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, no user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <div className="grain" aria-hidden="true" />
        <CustomCursor />
        <Header />
        {children}
        <Footer />
        <FloatingWhatsApp />
        <AmarChat />
        <Analytics />
      </body>
    </html>
  );
}
