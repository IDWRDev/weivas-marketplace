import type { ReactNode } from "react";
export function InformationPage({eyebrow,title,intro,children}:{eyebrow:string;title:string;intro:string;children:ReactNode}){return <main className="information-page"><header className="information-hero"><small>{eyebrow}</small><h1>{title}</h1><p>{intro}</p></header><article className="information-content">{children}</article></main>}
