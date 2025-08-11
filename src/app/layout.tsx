import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import { DM_Serif_Display, Inter } from "next/font/google";

import { DotBackground } from "@/components/backgrounds";

import "./globals.css";

import Footer from "@/components/footer/footer";
import NavHeader from "@/components/header/header";
import { Toaster } from "@/components/ui/sonner";

const dm_serif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Amar Editz",
  description: "Video Editz with love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dm_serif.variable}`}>
      <head>
        <meta property="og:title" content="Amar Editz" />
        <meta property="og:type" content="website" />
        <meta property="og:image:secure_url" content="https://media.amarjeetmishra.com/images/logo.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="60" />
        <meta property="og:image:height" content="60" />
        <meta property="og:image:alt" content="Amar Editz Logo" />
        <meta property="youtube:url" content="https://www.youtube.com/@AmarEditzOfficial" />
        <meta property="instagram:url" content="https://www.instagram.com/amarjeetmishra001/" />
      </head>
      <body
        className="antialiased [perspective::1000px] [transform-style:preserve-3d] flex flex-col mx-auto bg-black overflow-x-hidden w-full relative"
      >
        {/* <GridBackground /> */}
        <DotBackground />
        <NavHeader />
        <main className="min-h-screen flex-grow z-30 relative ">
          {children}
          <Footer />
        </main>
        {/* </GridBackground> */}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
