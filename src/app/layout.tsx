import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";
import Script from "next/script";
import { AmarChat } from "@/components/chat/AmarChat";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { DEFAULT_PALETTE, PALETTE_IDS } from "@/constants/themes";
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
  display: "swap",
  preload: false,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
  preload: false,
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "400x400" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "400x400", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, no user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          themes={PALETTE_IDS}
          defaultTheme={DEFAULT_PALETTE}
          enableSystem={false}
          enableColorScheme={false}
          disableTransitionOnChange
          storageKey="palette"
        >
          <div className="grain" aria-hidden="true" />
          <CustomCursor />
          <Header />
          {children}
          <Footer />
          <FloatingWhatsApp />
          <AmarChat />
        </ThemeProvider>
        <Analytics />
        <Script
          defer
          src="https://umami.parmjeetmishra.com/script.js"
          data-website-id="9df9d647-28aa-4de4-8055-cac92f2b756e"
        />
        <Script
          defer
          src="https://umami.parmjeetmishra.com/recorder.js"
          data-website-id="9df9d647-28aa-4de4-8055-cac92f2b756e"
        />
      </body>
    </html>
  );
}
