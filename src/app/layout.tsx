import type { Metadata } from "next";
import "@fontsource/poppins/400.css";import "@fontsource/poppins/500.css";import "@fontsource/poppins/600.css";import "@fontsource/poppins/700.css";
import "./globals.css";import "../styles/search.css";import "../styles/quality.css";import "../styles/auth.css";
export const metadata:Metadata={title:{default:"Weivas — Good things, handpicked for you",template:"%s | Weivas"},description:"A premium global marketplace connecting buyers with verified sellers."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>}
