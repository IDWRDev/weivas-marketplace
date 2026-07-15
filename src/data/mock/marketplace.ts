import type { Order, Product } from "@/types/marketplace";
export const categories=[{name:"Electronics",icon:"⌁"},{name:"Computers & Office",icon:"▣"},{name:"Phones & Accessories",icon:"▯"},{name:"Home Appliances",icon:"⌂"},{name:"Fashion & Apparel",icon:"◇"},{name:"Beauty & Personal Care",icon:"✦"},{name:"Sports & Outdoors",icon:"◉"},{name:"Automotive",icon:"◌"},{name:"Industrial & Tools",icon:"⚙"}];
export const products:Product[]=[
{id:"p1",name:"Wireless Noise-Cancelling Headphones",category:"Electronics",price:129.99,oldPrice:159.99,rating:4.8,emoji:"🎧",sku:"WH-1000XMS",stock:120,status:"Active"},
{id:"p2",name:"Smart Watch Series 8",category:"Electronics",price:59.99,oldPrice:99.99,rating:4.6,emoji:"⌚",sku:"SW-S8-45",stock:85,status:"Active"},
{id:"p3",name:"Stainless Steel Water Bottle",category:"Home & Living",price:18.99,rating:4.7,emoji:"🧴",sku:"WB-SS-1L",stock:0,status:"Out of Stock"},
{id:"p4",name:"Everyday Running Sneakers",category:"Fashion",price:49.99,oldPrice:79.99,rating:4.9,emoji:"👟",sku:"RS-LW-42",stock:64,status:"Active"},
{id:"p5",name:"Programmable Coffee Maker",category:"Home Appliances",price:89.99,oldPrice:129.99,rating:4.5,emoji:"☕",sku:"CM-12C",stock:8,status:"Low Stock"},
{id:"p6",name:"Leather Laptop Bag",category:"Fashion",price:45.99,rating:4.7,emoji:"💼",sku:"LB-PRO",stock:24,status:"Under Review"}
];
export const orders:Order[]=[{id:"WIV-2026-00123",item:"Smart Watch Series 8",date:"July 12, 2026",total:89.99,status:"Delivered",emoji:"⌚"},{id:"WIV-2026-00122",item:"Running Sneakers",date:"July 10, 2026",total:129.99,status:"In transit",emoji:"👟"},{id:"WIV-2026-00121",item:"Coffee Maker",date:"July 8, 2026",total:49.99,status:"Processing",emoji:"☕"}];
export const sellerMetrics=[{label:"Total Sales",value:"$8,456.78",change:"+12.8%"},{label:"Orders",value:"156",change:"+8.3%"},{label:"Visitors",value:"3,245",change:"+15.2%"},{label:"Conversion Rate",value:"4.8%",change:"+0.4%"},{label:"Payout Balance",value:"$2,450.60",change:"Available"}];
