import { useEffect, useState } from "react";
import { Minus, PackageSearch, Plus, ShoppingCart, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CartItem } from "@/components/ShoppingCart";

export type ProductDetailProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  price: number;
  stockCount: number;
  gallery: string[];
  description: string;
  specifications: Array<{ label: string; value: string }>;
  cartItem: Omit<CartItem, "quantity">;
};

type ProductDetailDialogProps = {
  product: ProductDetailProduct | null;
  relatedProducts: ProductDetailProduct[];
  onSelectProduct: (product: ProductDetailProduct | null) => void;
  onAddToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
};

const money = (amount: number) => `$ ${amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

export function ProductDetailDialog({ product, relatedProducts, onSelectProduct, onAddToCart }: ProductDetailDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specifications">("description");

  useEffect(() => {
    setQuantity(1);
    setImageIndex(0);
    setActiveTab("description");
  }, [product?.id]);

  const image = product?.gallery[imageIndex];

  return (
    <Dialog open={product !== null} onOpenChange={(open) => { if (!open) onSelectProduct(null); }}>
      {product && <DialogContent className="max-h-[94vh] max-w-6xl overflow-y-auto p-0">
        <DialogHeader className="border-b border-border px-5 py-4 pr-14 text-left md:px-8">
          <p className="text-xs font-bold uppercase text-primary">{product.category} · {product.brand}</p>
          <DialogTitle className="mt-1 text-xl font-black md:text-2xl">{product.name}</DialogTitle>
          <DialogDescription>Código: {product.sku}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-7 px-5 py-6 md:grid-cols-2 md:px-8">
          <div>
            <div className="flex aspect-square items-center justify-center overflow-hidden bg-muted/40 p-6">
              {image ? <img src={image} alt={`${product.name}, imagen ${imageIndex + 1}`} className="size-full object-contain" /> : <Wrench className="size-24 text-primary" />}
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Imágenes del producto">
              {product.gallery.length ? product.gallery.map((src, index) => (
                <button key={`${src}-${index}`} type="button" aria-label={`Ver imagen ${index + 1} de ${product.name}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)} className={`flex size-16 shrink-0 items-center justify-center border p-1 ${imageIndex === index ? "border-primary" : "border-border"}`}>
                  <img src={src} alt="" className="size-full object-contain" />
                </button>
              )) : <button type="button" aria-label={`Ver imagen de ${product.name}`} aria-pressed="true" className="flex size-16 items-center justify-center border border-primary text-primary"><Wrench className="size-6" /></button>}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-bold text-muted-foreground">{product.brand}</p>
            <p className="mt-3 text-3xl font-black text-primary">{money(product.price)}</p>
            <p className="text-xs text-muted-foreground">Precio con IVA incluido</p>
            <p className={`mt-4 flex items-center gap-2 text-sm font-bold ${product.stockCount > 0 ? "text-foreground" : "text-muted-foreground"}`}>
              <span className={`size-2 rounded-full ${product.stockCount > 0 ? "bg-green-600" : "bg-muted-foreground"}`} />
              {product.stockCount > 0 ? `En stock: ${product.stockCount} disponibles` : "Sin stock; cotiza disponibilidad"}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex h-11 items-center border border-border" aria-label="Cantidad">
                <button type="button" aria-label="Reducir cantidad" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex size-10 items-center justify-center disabled:opacity-40"><Minus className="size-4" /></button>
                <span className="min-w-9 text-center text-sm font-bold" aria-live="polite">{quantity}</span>
                <button type="button" aria-label="Aumentar cantidad" onClick={() => setQuantity((value) => Math.min(99, value + 1))} className="flex size-10 items-center justify-center"><Plus className="size-4" /></button>
              </div>
              <Button variant="dark" className="h-11 flex-1" onClick={() => { onAddToCart(product.cartItem, quantity); onSelectProduct(null); }}>
                <ShoppingCart /> {product.stockCount > 0 ? "Añadir al carrito" : "Cotizar"}
              </Button>
            </div>

            <div className="mt-8 border-b border-border" role="tablist" aria-label="Información del producto">
              <button type="button" role="tab" aria-selected={activeTab === "description"} onClick={() => setActiveTab("description")} className={`mr-5 border-b-2 pb-3 text-sm font-bold ${activeTab === "description" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>Descripción</button>
              <button type="button" role="tab" aria-selected={activeTab === "specifications"} onClick={() => setActiveTab("specifications")} className={`border-b-2 pb-3 text-sm font-bold ${activeTab === "specifications" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>Especificaciones</button>
            </div>
            {activeTab === "description" ? <p role="tabpanel" className="py-4 text-sm leading-6 text-muted-foreground">{product.description}</p> : (
              <dl role="tabpanel" className="divide-y divide-border py-2">
                {product.specifications.map(({ label, value }) => <div key={label} className="flex justify-between gap-4 py-2 text-sm"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-semibold">{value}</dd></div>)}
              </dl>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && <section className="border-t border-border px-5 py-6 md:px-8">
          <h3 className="flex items-center gap-2 text-lg font-black"><PackageSearch className="size-5 text-primary" /> También puede interesarte</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((related) => (
              <button key={related.id} type="button" onClick={() => onSelectProduct(related)} className="flex min-w-0 items-center gap-3 border border-border p-3 text-left transition-colors hover:border-primary">
                <span className="flex size-16 shrink-0 items-center justify-center bg-muted/40 p-1">{related.gallery[0] ? <img src={related.gallery[0]} alt="" className="size-full object-contain" /> : <Wrench className="size-7 text-primary" />}</span>
                <span className="min-w-0"><span className="block truncate text-xs font-bold">{related.name}</span><span className="mt-1 block text-sm font-black text-primary">{money(related.price)}</span></span>
              </button>
            ))}
          </div>
        </section>}
      </DialogContent>}
    </Dialog>
  );
}