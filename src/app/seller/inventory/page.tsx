import { Boxes, PackageX, TriangleAlert } from "lucide-react";
import { Card, Badge } from "@/components/ui/Primitives";
import { requireArea } from "@/server/auth/session";
import { getSellerInventory } from "@/server/services/sellers";

export default async function InventoryPage() {
  const session = await requireArea("seller");
  const products = await getSellerInventory(session.user.id);
  const low = products.filter(product => product.stock > 0 && product.stock <= product.lowStockThreshold);
  const out = products.filter(product => product.stock === 0);
  const value = products.reduce((sum, product) => sum + product.priceMinor * product.stock, 0);
  return <><header className="dash-head"><div><small>STOCK CONTROL</small><h1>Inventory</h1><p>Seller-owned stock, variants and low-stock thresholds.</p></div><Boxes aria-hidden="true" /></header><div className="metrics four"><Card><small>Products tracked</small><strong>{products.length}</strong></Card><Card><small>Low stock</small><strong>{low.length}</strong></Card><Card><small>Out of stock</small><strong>{out.length}</strong></Card><Card className="dark-card"><small>Retail stock value</small><strong>${(value/100).toLocaleString(undefined,{minimumFractionDigits:2})}</strong></Card></div><Card className="table-card"><div className="panel-heading"><h2>Stock levels</h2><Badge tone={out.length?"red":"green"}>{out.length ? `${out.length} require attention` : "Stock healthy"}</Badge></div>{products.length ? <div className="responsive-list">{products.map(product=><article className="inventory-row" key={product.id}><span className="inventory-icon">{product.stock===0?<PackageX/>:<TriangleAlert/>}</span><div><b>{product.title}</b><small>{product.sku} · {product.category.name} · {product.variants.length} variants</small></div><strong>{product.stock} units</strong><Badge tone={product.stock===0?"red":product.stock<=product.lowStockThreshold?"orange":"green"}>{product.stock===0?"Out of stock":product.stock<=product.lowStockThreshold?"Low stock":"In stock"}</Badge></article>)}</div> : <div className="premium-empty"><Boxes/><h2>No inventory yet</h2><p>Create a product draft to begin tracking stock.</p></div>}</Card></>;
}
