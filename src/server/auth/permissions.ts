export type AuthPrincipal={id:string;role:"buyer"|"seller"|"admin";status:"pending"|"active"|"suspended"|"disabled";sellerApplicationStatus?:"draft"|"submitted"|"under_review"|"needs_information"|"approved"|"rejected"|"suspended"};
export function canAccessProtectedArea(user:AuthPrincipal|undefined,area:"account"|"seller"|"admin"){
  if(!user) return {allowed:false,reason:"sign_in"} as const;
  if(user.status!=="active") return {allowed:false,reason:"account_status"} as const;
  if(area==="account") return {allowed:true,reason:"allowed"} as const;
  if(area==="admin") return user.role==="admin"?{allowed:true,reason:"allowed"} as const:{allowed:false,reason:"unauthorised"} as const;
  if(user.sellerApplicationStatus==="approved") return {allowed:true,reason:"allowed"} as const;
  if(!user.sellerApplicationStatus) return {allowed:false,reason:"seller_application"} as const;
  return {allowed:false,reason:"seller_status"} as const;
}
export const ownsResource=(principalId:string,ownerId:string)=>principalId===ownerId;
