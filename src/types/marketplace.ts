export type ProductStatus = "Active" | "Low Stock" | "Out of Stock" | "Under Review";
export interface Product { id:string; name:string; category:string; price:number; oldPrice?:number; rating:number; emoji:string; sku:string; stock:number; status:ProductStatus; }
export interface Order { id:string; item:string; date:string; total:number; status:"Delivered"|"In transit"|"Processing"; emoji:string; }
