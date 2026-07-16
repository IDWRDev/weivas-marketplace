import "next-auth";
type ApplicationStatus="draft"|"submitted"|"under_review"|"needs_information"|"approved"|"rejected"|"suspended";
declare module "next-auth" { interface Session { user:{id:string;email:string;name:string;role:"buyer"|"seller"|"admin";status:"pending"|"active"|"suspended"|"disabled";sellerApplicationStatus?:ApplicationStatus} } interface User { role:"buyer"|"seller"|"admin";status:"pending"|"active"|"suspended"|"disabled";sellerApplicationStatus?:ApplicationStatus } }
declare module "next-auth/jwt" { interface JWT { id:string;role:"buyer"|"seller"|"admin";status:"pending"|"active"|"suspended"|"disabled";sellerApplicationStatus?:ApplicationStatus } }
