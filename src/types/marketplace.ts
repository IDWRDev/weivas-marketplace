export type ProductStatus = "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected" | "Active" | "Low Stock" | "Out of Stock" | "Suspended";
export type ProductVariant = "compact"|"standard"|"deal"|"wholesale"|"editorial";
export interface Category { id:string; slug:string; name:string; icon:string; }
export interface Product { id:string; slug:string; name:string; category:string; categorySlug:string; sellerId:string; price:number; oldPrice?:number; rating:number; reviewCount?:number; sold?:number; emoji:string; sku:string; stock:number; status:ProductStatus; verified?:boolean; productVerified?:boolean; delivery?:string; warranty?:string; supplierCountry?:string; moq?:number; brand?:string; }
export interface Seller { id:string; slug:string; name:string; logo:string; country:string; rating:number; feedback:number; responseRate:number; completedOrders:number; featured:string[]; yearsActive?:number; followers?:number; verified:boolean; storeId:string; }
export interface CartItem { productId:string; quantity:number; selectedVariantId?:string; }
export type CheckoutMode = "cart" | "buy_now";
export interface CheckoutState { mode:CheckoutMode; items:CartItem[]; }
export interface Order { id:string; item:string; date:string; total:number; status:"Delivered"|"In transit"|"Processing"; emoji:string; }
