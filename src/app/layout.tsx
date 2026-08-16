import type { Metadata } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";
import "../styles/search.css";
import "../styles/quality.css";
import "../styles/auth.css";
import "../styles/header.css";
import "../styles/professional.css";
import "../styles/information.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://weivas.com"),
  title: { default: "Weivas | Verified marketplace for quality products", template: "%s | Weivas" },
  description: "Weivas is a trusted marketplace for quality products from verified sellers. Discover, compare and shop with confidence.",
  applicationName: "Weivas",
  keywords: ["Weivas", "Weivas marketplace", "verified sellers", "online marketplace", "quality products"],
  authors: [{ name: "Weivas" }],
  creator: "Weivas",
  publisher: "Weivas",
  category: "Marketplace",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Weivas", title: "Weivas | Verified marketplace for quality products", description: "Discover quality products from verified sellers on Weivas.", url: "/", images: [{ url: "/brand/favicon/weivas-favicon-master.png", width: 512, height: 512, alt: "Weivas" }] },
  twitter: { card: "summary", title: "Weivas | Verified marketplace for quality products", description: "Discover quality products from verified sellers on Weivas.", images: ["/brand/favicon/weivas-favicon-master.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  icons: { icon: [{ url: "/favicon.ico?v=4", sizes: "any" }, { url: "/icon.png?v=4", type: "image/png", sizes: "512x512" }], shortcut: "/favicon.ico?v=4", apple: [{ url: "/apple-icon.png?v=4", sizes: "180x180", type: "image/png" }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://weivas.com";
  const structuredData = { "@context": "https://schema.org", "@graph": [{ "@type": "Organization", name: "Weivas", url: baseUrl, logo: `${baseUrl}/brand/favicon/weivas-favicon-master.png`, description: "A trusted marketplace for quality products from verified sellers." }, { "@type": "WebSite", name: "Weivas", url: baseUrl, potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${baseUrl}/search?q={search_term_string}` }, "query-input": "required name=search_term_string" } }] };
  return <html lang="en" data-scroll-behavior="smooth"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />{children}</body></html>;
}
