import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chunhuduc.com"),
  title: {
    default: "CHU NHƯ ĐỨC · Solution Architect",
    template: "%s · CHU NHƯ ĐỨC",
  },
  description:
    "Solution Architect and hands-on engineer. TypeScript, Node, enterprise web, distributed systems, and AI-assisted automation.",
  openGraph: {
    type: "website",
    locale: "en",
    url: "https://chunhuduc.com",
    siteName: "chunhuduc.com",
    title: "CHU NHƯ ĐỨC · Solution Architect",
    description:
      "Solution Architect and hands-on engineer. TypeScript, Node, enterprise web, distributed systems.",
  },
  icons: {
    icon: [{ url: "/favi.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <SiteHeader />
        <SiteShell>{children}</SiteShell>
        <SiteFooter />
      </body>
    </html>
  );
}
