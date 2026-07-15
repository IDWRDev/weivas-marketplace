export type ProductStatus = "Active" | "Low Stock" | "Out of Stock" | "Under Review";
export type ProductVariant = "compact"|"standard"|"deal"|"wholesale"|"editorial";
export interface Product { id:string; name:string; category:string; price:number; oldPrice?:number; rating:number; reviewCount?:number; emoji:string; sku:string; stock:number; status:ProductStatus; verified?:boolean; productVerified?:boolean; delivery?:string; warranty?:string; supplierCountry?:string; moq?:number; }
export interface Seller { id:string; name:string; logo:string; country:string; rating:number; feedback:number; responseRate:number; completedOrders:number; featured:string[]; }
export interface Order { id:string; item:string; date:string; total:number; status:"Delivered"|"In transit"|"Processing"; emoji:string; }
