import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(function proxy(request){
  const token=request.nextauth.token;
  const path=request.nextUrl.pathname;
  if(!token){
    const signIn=path.startsWith("/seller")?"/auth/seller-sign-in":"/auth/sign-in";
    const url=new URL(signIn,request.url);
    url.searchParams.set("callbackUrl",request.url);
    return NextResponse.redirect(url);
  }
  if(token.status!=="active")return NextResponse.redirect(new URL("/auth/unauthorised?reason=account-status",request.url));
  if(path.startsWith("/admin")&&token.role!=="admin")return NextResponse.redirect(new URL("/auth/unauthorised",request.url));
  if(path.startsWith("/seller")){
    if(!token.sellerApplicationStatus)return NextResponse.redirect(new URL("/sell/onboarding",request.url));
    if(token.sellerApplicationStatus!=="approved")return NextResponse.redirect(new URL("/sell/status",request.url));
  }
  return NextResponse.next();
},{callbacks:{authorized:()=>true}});

export const config={matcher:["/account/:path*","/seller/:path*","/admin/:path*"]};
