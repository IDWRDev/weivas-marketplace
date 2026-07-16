import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { CartExperience, CheckoutExperience, ProductExperience, StoreExperience } from "./CommerceFlows";
import { getProductById, getSellerById, getProductsBySellerId } from "@/data/mock/marketplace";
import { useMarketplaceStore } from "@/stores/marketplace-store";

const push=vi.fn();
vi.mock("next/navigation",()=>({useRouter:()=>({push}),usePathname:()=>"/"}));
vi.mock("next/link",()=>({default:({href,children,...props}:React.AnchorHTMLAttributes<HTMLAnchorElement>)=><a href={String(href)} {...props}>{children}</a>}));
vi.mock("@/app/(marketplace)/checkout/actions",()=>({placeOrder:vi.fn()}));
vi.mock("@/app/marketplace-actions",()=>({syncCartItem:vi.fn(),togglePersistentWishlist:vi.fn()}));

describe("commerce flows",()=>{
  beforeEach(()=>{localStorage.clear();push.mockClear();act(()=>useMarketplaceStore.setState({cart:{},wishlist:[],checkout:null}))});

  it("shows a real empty cart with no phantom products",()=>{
    render(<CartExperience/>);
    expect(screen.getByRole("heading",{name:"Your cart is empty"})).toBeInTheDocument();
    expect(screen.queryByText(getProductById("p1")!.name)).not.toBeInTheDocument();
  });

  it("updates quantity totals and reveals the empty state after removing the last item",()=>{
    act(()=>useMarketplaceStore.getState().addToCart("p1"));
    render(<CartExperience/>);
    const product=getProductById("p1")!;
    expect(screen.getByText(product.name)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(`Increase ${product.name}`));
    expect(screen.getByText("2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:/Remove/}));
    expect(screen.getByRole("heading",{name:"Your cart is empty"})).toBeInTheDocument();
  });

  it("keeps Buy Now distinct and checks out only the selected product",()=>{
    const product=getProductById("p4")!;
    const productView=render(<ProductExperience product={product}/>);
    fireEvent.click(screen.getByLabelText("Increase quantity"));
    fireEvent.click(screen.getByRole("button",{name:"Buy now"}));
    expect(push).toHaveBeenCalledWith("/checkout");
    expect(useMarketplaceStore.getState().cart).toEqual({});
    expect(useMarketplaceStore.getState().checkout).toEqual({mode:"buy_now",items:[{productId:"p4",quantity:2}]});
    productView.unmount();
    const checkoutView=render(<CheckoutExperience/>);
    expect(within(checkoutView.container).getByText(`${product.name} × 2`)).toBeInTheDocument();
    expect(within(checkoutView.container).queryByText(getProductById("p1")!.name)).not.toBeInTheDocument();
  });

  it("links products to their canonical seller and limits a store to that seller",()=>{
    const product=getProductById("p4")!; const seller=getSellerById(product.sellerId)!;
    const productView=render(<ProductExperience product={product}/>);
    expect(within(productView.container).getByRole("link",{name:new RegExp(`Sold by ${seller.name}`)})).toHaveAttribute("href",`/store/${seller.slug}`);
    productView.unmount();
    const storeView=render(<StoreExperience seller={seller}/>);
    for(const owned of getProductsBySellerId(seller.id)) expect(within(storeView.container).getByText(owned.name)).toBeInTheDocument();
    expect(within(storeView.container).queryByText(getProductById("p1")!.name)).not.toBeInTheDocument();
  });
});
