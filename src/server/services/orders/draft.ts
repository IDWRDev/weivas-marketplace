export type DraftLine={productId:string;variantId?:string;sellerProfileId:string;storeId:string;title:string;sku:string;unitPriceMinor:number;quantity:number;stock:number;available:boolean};
export function createOrderDraft(input:{buyerId:string;currency:string;addressId:string;lines:DraftLine[]}){
  if(!input.buyerId||!input.addressId) throw new Error("Buyer and delivery address are required");
  if(input.lines.length===0) throw new Error("Order requires at least one item");
  for(const line of input.lines) if(!line.available||line.quantity<1||line.quantity>line.stock) throw new Error(`Unavailable order item: ${line.productId}`);
  const groups=new Map<string,DraftLine[]>();for(const line of input.lines)groups.set(line.sellerProfileId,[...(groups.get(line.sellerProfileId)??[]),line]);
  const sellerOrders=[...groups].map(([sellerProfileId,lines])=>({sellerProfileId,storeId:lines[0].storeId,status:"pending_payment" as const,subtotalMinor:lines.reduce((sum,line)=>sum+line.unitPriceMinor*line.quantity,0),items:lines.map((line)=>({productId:line.productId,variantId:line.variantId,productTitleSnapshot:line.title,skuSnapshot:line.sku,unitPriceMinor:line.unitPriceMinor,quantity:line.quantity,lineTotalMinor:line.unitPriceMinor*line.quantity}))}));
  const subtotalMinor=sellerOrders.reduce((sum,order)=>sum+order.subtotalMinor,0);return {buyerId:input.buyerId,currency:input.currency,status:"pending_payment" as const,subtotalMinor,totalMinor:subtotalMinor,sellerOrders};
}
