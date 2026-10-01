import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Wrench } from "lucide-react";
import type { CartItem } from "@/components/ShoppingCart";
import type { ProductDetailProduct } from "@/components/ProductDetailDialog";

type ProductQuickViewProps = {
  product: ProductDetailProduct | null;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
};

const BRAND_LOGOS: Record<string, string> = {
  GOODYEAR: "/marcas/goodyear.png",
  TORNEL: "/marcas/tornel.png",
  "JK TYRE": "/marcas/jktyre.png",
  "TOLEDO TYRES": "/marcas/toledo.png",
  LTH: "/marcas/lth-auto.png",
};

const money = (amount: number) => `$ ${amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

export function ProductQuickView({ product, onClose, onAddToCart }: ProductQuickViewProps) {
  return (
    <Dialog open={product !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      {product && <DialogContent className="grid w-[calc(100vw-2rem)] max-w-2xl grid-cols-1 items-center gap-5 p-5 sm:grid-cols-2 sm:gap-6 sm:p-6">
        <div className="flex aspect-square items-center justify-center bg-muted/40 p-3 sm:p-4">
          {product.gallery[0] ? <img src={product.gallery[0]} alt={product.name} className="size-full object-contain" /> : <Wrench className="size-20 text-primary" />}
        </div>
        <div className="min-w-0">
          <div className="flex h-7 items-center">
            {BRAND_LOGOS[product.brand]
              ? <img src={BRAND_LOGOS[product.brand]} alt={`Logo ${product.brand}`} className="max-h-6 max-w-28 object-contain object-left" />
              : <span className="text-xs font-black uppercase text-primary">{product.brand}</span>}
          </div>
          <h2 className="mt-2 text-xl font-black leading-tight">{product.name}</h2>
          <p className="mt-2 line-clamp-3 text-sm leading-5 text-muted-foreground">{product.description}</p>
          <p className="mt-5 text-2xl font-black">{money(product.price)}</p>
          <p className="text-xs text-muted-foreground">Precio con IVA incluido</p>
          <p className={`mt-3 text-xs font-semibold ${product.stockCount > 0 ? "text-green-700" : "text-muted-foreground"}`}>
            {product.stockCount > 0 ? `${product.stockCount} disponibles` : "Disponibilidad por confirmar"}
          </p>
          <Button variant="hero" className="mt-4 h-11 w-full" onClick={() => { onAddToCart(product.cartItem); onClose(); }}>
            <ShoppingCart /> {product.stockCount > 0 ? "Añadir al carrito" : "Cotizar"}
          </Button>
        </div>
      </DialogContent>}
    </Dialog>
  );
}