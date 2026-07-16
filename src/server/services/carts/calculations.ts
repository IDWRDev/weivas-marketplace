import { getCartTotals, resolveCartItems } from "@/lib/marketplace";
export { getCartTotals, resolveCartItems };
export type MergeCartItem={productId:string;variantId?:string;quantity:number;available?:boolean;stock?:number};
export function mergeCartItems(local:MergeCartItem[],persisted:MergeCartItem[]){
  const merged=new Map<string,MergeCartItem>();
  for(const item of [...persisted,...local]){const key=`${item.productId}:${item.variantId??""}`;const current=merged.get(key);const quantity=(current?.quantity??0)+item.quantity;merged.set(key,{...current,...item,quantity:Math.max(0,Math.min(quantity,item.stock??Number.MAX_SAFE_INTEGER))});}
  return [...merged.values()].filter((item)=>item.quantity>0).map((item)=>({...item,available:item.available!==false}));
}
