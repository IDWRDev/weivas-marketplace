import type { Order, Product, Seller } from "@/types/marketplace";

export const categories = [
  ["Electronics", "⌁"], ["Computers & Office", "▣"], ["Phones & Accessories", "▯"],
  ["Home Appliances", "⌂"], ["Home & Kitchen", "♨"], ["Fashion & Apparel", "◇"],
  ["Beauty & Personal Care", "✦"], ["Toys, Kids & Baby", "☆"], ["Sports & Outdoors", "◉"],
  ["Automotive", "◌"], ["Industrial & Tools", "⚙"], ["Business & Office Supplies", "▤"],
].map(([name, icon]) => ({ name, icon }));

const base = { verified: true, sellerName: "Nova Technology Store", supplierCountry: "Singapore" };
export const products: Product[] = [
  { ...base, id:"p1", name:"Wireless Noise-Cancelling Headphones", brand:"Nova Audio", category:"Electronics", price:129.99, oldPrice:159.99, rating:4.8, reviewCount:2400, sold:6200, emoji:"🎧", sku:"WH-1000XMS", stock:120, status:"Active", productVerified:true, delivery:"2-day delivery", warranty:"2-year warranty" },
  { ...base, id:"p2", name:"Smart Watch Series 8", brand:"Kinetic", category:"Electronics", price:59.99, oldPrice:99.99, rating:4.6, reviewCount:1128, sold:3400, emoji:"⌚", sku:"SW-S8-45", stock:85, status:"Active", productVerified:true, delivery:"Free delivery", warranty:"1-year warranty" },
  { ...base, id:"p3", name:"Stainless Steel Water Bottle", brand:"Hearth", category:"Home & Living", price:18.99, rating:4.7, reviewCount:1930, sold:5100, emoji:"🧴", sku:"WB-SS-1L", stock:0, status:"Out of Stock", delivery:"Ships in 24 hours" },
  { ...base, id:"p4", name:"Everyday Running Sneakers", brand:"Motion", category:"Fashion", price:49.99, oldPrice:79.99, rating:4.9, reviewCount:3900, sold:8700, emoji:"👟", sku:"RS-LW-42", stock:64, status:"Active", productVerified:true, delivery:"Fast delivery" },
  { ...base, id:"p5", name:"Programmable Coffee Maker", brand:"Hearth", category:"Home Appliances", price:89.99, oldPrice:129.99, rating:4.5, reviewCount:890, sold:1600, emoji:"☕", sku:"CM-12C", stock:8, status:"Low Stock", delivery:"Free delivery" },
  { ...base, id:"p6", name:"Leather Laptop Bag", brand:"Arc & Co.", category:"Fashion", price:45.99, rating:4.7, reviewCount:2550, sold:2900, emoji:"💼", sku:"LB-PRO", stock:24, status:"Under Review", delivery:"3-day delivery" },
  { ...base, id:"p7", name:"Ultra-Slim Professional Laptop", brand:"Nova", category:"Computers & Office", price:849.99, oldPrice:999.99, rating:4.8, reviewCount:734, sold:980, emoji:"💻", sku:"LP-PRO-14", stock:32, status:"Active", productVerified:true, delivery:"Express delivery", warranty:"2-year warranty" },
  { ...base, id:"p8", name:"Compact Wireless Earbuds Pro", brand:"Nova Audio", category:"Electronics", price:29.99, oldPrice:44.99, rating:4.6, reviewCount:4300, sold:11400, emoji:"🎶", sku:"EB-PRO-2", stock:210, status:"Active", productVerified:true, delivery:"Free delivery", warranty:"1-year warranty" },
  { ...base, id:"p9", name:"Nordic Ceramic Dinnerware Set", brand:"Hearth", category:"Home & Living", price:64.99, rating:4.9, reviewCount:612, sold:720, emoji:"🍽️", sku:"DW-NRD-12", stock:41, status:"Active", delivery:"Ships tomorrow" },
  { ...base, id:"p10", name:"Ergonomic Executive Office Chair", brand:"Origo", category:"Business Supplies", price:189.99, oldPrice:239.99, rating:4.7, reviewCount:985, sold:1400, emoji:"🪑", sku:"CHR-ERG-1", stock:18, status:"Active", delivery:"5-day delivery" },
  { ...base, id:"p11", name:"Natural Skincare Essentials Kit", brand:"Pure Form", category:"Beauty", price:39.99, rating:4.8, reviewCount:1732, sold:3200, emoji:"🧴", sku:"SK-NAT-5", stock:75, status:"Active", productVerified:true, delivery:"Free delivery" },
  { ...base, id:"p12", name:"All-in-One Wireless Printer", brand:"Nova Office", category:"Business Supplies", price:159.99, oldPrice:189.99, rating:4.5, reviewCount:420, sold:670, emoji:"🖨️", sku:"PR-AIO-W", stock:26, status:"Active", delivery:"Fast delivery", warranty:"2-year warranty" },
];

export const sellers: Seller[] = [
  { id:"s1", name:"Nova Technology Store", logo:"N", country:"Singapore", rating:4.9, feedback:98, responseRate:97, completedOrders:12400, yearsActive:6, followers:48600, featured:["💻","🎧","⌚"] },
  { id:"s2", name:"Hearth & Haven", logo:"H", country:"United Kingdom", rating:4.8, feedback:97, responseRate:95, completedOrders:8750, yearsActive:4, followers:27100, featured:["☕","🍽️","🪑"] },
  { id:"s3", name:"Motion Supply Co.", logo:"M", country:"Germany", rating:4.7, feedback:96, responseRate:98, completedOrders:9320, yearsActive:5, followers:31800, featured:["👟","💼","🎒"] },
];

export const wholesale: Product[] = [
  { ...products[8], id:"w1", name:"Restaurant Ceramic Sets — 24 Pack", price:289, moq:5, supplierCountry:"Portugal" },
  { ...products[9], id:"w2", name:"Ergonomic Office Chairs — Bulk", price:139, moq:10, supplierCountry:"Germany" },
  { ...products[7], id:"w3", name:"Wireless Earbuds — Custom Brand", price:12.5, moq:100, supplierCountry:"Vietnam" },
];
export const orders: Order[] = [
  { id:"WIV-2026-00123", item:"Smart Watch Series 8", date:"July 12, 2026", total:89.99, status:"Delivered", emoji:"⌚" },
  { id:"WIV-2026-00122", item:"Running Sneakers", date:"July 10, 2026", total:129.99, status:"In transit", emoji:"👟" },
  { id:"WIV-2026-00121", item:"Coffee Maker", date:"July 8, 2026", total:49.99, status:"Processing", emoji:"☕" },
];
export const sellerMetrics = [
  {label:"Total sales",value:"$8,456.78",change:"+12.8%"}, {label:"Orders",value:"156",change:"+8.3%"},
  {label:"Visitors",value:"3,245",change:"+15.2%"}, {label:"Conversion rate",value:"4.8%",change:"+0.4%"},
  {label:"Payout balance",value:"$2,450.60",change:"Available"},
];
