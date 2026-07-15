import Image from "next/image";
const basePath=process.env.NEXT_PUBLIC_BASE_PATH??"";
export function WeivasLogo({className=""}:{className?:string}){return <Image className={className} src={`${basePath}/brand/logo/primary/weivas-primary.png`} width={1536} height={512} alt="Weivas" priority/>}
