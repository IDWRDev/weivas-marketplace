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

export const metadata:Metadata={
  metadataBase:new URL(process.env.NEXT_PUBLIC_APP_URL??"https://weivas.com"),
  title:{default:"Weivas — Good things, handpicked for you",template:"%s | Weivas"},
  description:"A premium global marketplace connecting buyers with verified sellers.",
  icons:{icon:[{url:"/favicon.ico?v=4",sizes:"any"},{url:"/icon.png?v=4",type:"image/png",sizes:"512x512"}],shortcut:"/favicon.ico?v=4",apple:[{url:"/apple-icon.png?v=4",sizes:"180x180",type:"image/png"}]},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>}
