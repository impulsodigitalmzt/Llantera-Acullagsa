import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, PackageSearch, Plus, ShoppingCart, Wrench } from "lucide-react";
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
  const relatedRail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuantity(1);
    setImageIndex(0);
    setActiveTab("description");
  }, [product?.id]);

  const image = product?.gallery[imageIndex];

  return (
    <Dialog open={product !== null} onOpenChange={(open) => { if (!open) onSelectProduct(null); }}>
      {product && <DialogContent className="block max-h-[96vh] w-[calc(100vw-1rem)] max-w-7xl overflow-y-auto p-0 sm:rounded-md">
        <div className="grid gap-6 px-4 py-7 sm:px-7 md:grid-cols-2 md:gap-9 md:px-9 md:py-9">
          <section className="grid min-w-0 gap-3 md:grid-cols-[68px_minmax(0,1fr)]" aria-label="Galería del producto">
            <div className="order-2 flex gap-2 overflow-x-auto pb-1 md:order-1 md:flex-col md:overflow-x-visible" aria-label="Imágenes del producto">
              {product.gallery.length ? product.gallery.map((src, index) => (
                <button key={`${src}-${index}`} type="button" aria-label={`Ver imagen ${index + 1} de ${product.name}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)} className={`flex size-14 shrink-0 items-center justify-center border p-1 sm:size-16 ${imageIndex === index ? "border-primary" : "border-border"}`}>
                  <img src={src} alt="" className="size-full object-contain" />
                </button>
              )) : <button type="button" aria-label={`Ver imagen de ${product.name}`} aria-pressed="true" className="flex size-14 shrink-0 items-center justify-center border border-primary text-primary sm:size-16"><Wrench className="size-6" /></button>}
            </div>
            <div className="order-1 flex aspect-square min-h-0 items-center justify-center overflow-hidden bg-background p-2 md:order-2 md:aspect-[4/3] md:p-5">
              {image ? <img src={image} alt={`${product.name}, imagen ${imageIndex + 1}`} className="size-full object-contain" /> : <Wrench className="size-24 text-primary" />}
            </div>
          </section>

          <section className="flex min-w-0 flex-col">
            <DialogHeader className="text-left">
              <p className="text-xs font-bold uppercase text-primary">{product.category} · {product.brand}</p>
              <DialogTitle className="mt-2 text-xl font-black sm:text-2xl">{product.name}</DialogTitle>
              <DialogDescription>Código: {product.sku}</DialogDescription>
            </DialogHeader>
            <p className="mt-6 text-3xl font-black text-primary">{money(product.price)}</p>
            <p className="text-xs text-muted-foreground">Precio con IVA incluido</p>
            <p className={`mt-4 flex items-center gap-2 text-sm font-bold ${product.stockCount > 0 ? "text-foreground" : "text-muted-foreground"}`}>
              <span className={`size-2 rounded-full ${product.stockCount > 0 ? "bg-green-600" : "bg-muted-foreground"}`} />
              {product.stockCount > 0 ? `En stock: ${product.stockCount} disponibles` : "Sin stock; cotiza disponibilidad"}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex h-11 items-center border border-border" aria-label="Cantidad">
                <button type="button" aria-label="Reducir cantidad" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex size-10 items-center justify-center disabled:opacity-40"><Minus className="size-4" /></button>
                <span className="min-w-9 text-center text-sm font-bold" aria-live="polite">{quantity}</span>
                <button type="button" aria-label="Aumentar cantidad" onClick={() => setQuantity((value) => Math.min(99, value + 1))} className="flex size-10 items-center justify-center"><Plus className="size-4" /></button>
              </div>
              <Button variant="dark" className="h-11 flex-1" onClick={() => { onAddToCart(product.cartItem, quantity); onSelectProduct(null); }}>
                <ShoppingCart /> {product.stockCount > 0 ? "Añadir al carrito" : "Cotizar"}
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">Marca: <span className="font-semibold text-foreground">{product.brand}</span></p>
          </section>
        </div>

        <section className="border-t border-border px-4 py-6 sm:px-7 md:px-9" aria-label="Descripción y especificaciones">
          <div className="border-b border-border" role="tablist" aria-label="Información del producto">
            <button type="button" role="tab" aria-selected={activeTab === "description"} onClick={() => setActiveTab("description")} className={`mr-6 border-b-2 pb-3 text-sm font-bold ${activeTab === "description" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>Descripción</button>
            <button type="button" role="tab" aria-selected={activeTab === "specifications"} onClick={() => setActiveTab("specifications")} className={`border-b-2 pb-3 text-sm font-bold ${activeTab === "specifications" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>Características</button>
          </div>
          {activeTab === "description" ? <div role="tabpanel" className="max-w-4xl py-5 text-sm leading-7 text-muted-foreground"><h3 className="mb-2 text-base font-black text-foreground">Descripción del producto</h3><p>{product.description}</p></div> : (
            <dl role="tabpanel" className="grid gap-x-10 divide-y divide-border py-3 sm:grid-cols-2">
              {product.specifications.map(({ label, value }) => <div key={label} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-semibold">{value}</dd></div>)}
            </dl>
          )}
        </section>

        {relatedProducts.length > 0 && <section className="border-t border-border px-4 py-6 sm:px-7 md:px-9">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-lg font-black"><PackageSearch className="size-5 text-primary" /> También puede interesarte</h3>
            <div className="flex shrink-0 gap-1">
              <button type="button" aria-label="Productos relacionados anteriores" onClick={() => relatedRail.current?.scrollBy({ left: -260, behavior: "smooth" })} className="flex size-9 items-center justify-center border border-border hover:bg-muted"><ChevronLeft className="size-4" /></button>
              <button type="button" aria-label="Más productos relacionados" onClick={() => relatedRail.current?.scrollBy({ left: 260, behavior: "smooth" })} className="flex size-9 items-center justify-center border border-border hover:bg-muted"><ChevronRight className="size-4" /></button>
            </div>
          </div>
          <div ref={relatedRail} className="mt-4 grid auto-cols-[minmax(190px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-3 [scroll-snap-type:x_mandatory]">
            {relatedProducts.slice(0, 8).map((related) => (
              <button key={related.id} type="button" onClick={() => onSelectProduct(related)} className="min-w-0 border border-border p-3 text-left transition-colors hover:border-primary [scroll-snap-align:start]">
                <span className="flex aspect-[4/3] items-center justify-center bg-muted/30 p-2">{related.gallery[0] ? <img src={related.gallery[0]} alt="" className="size-full object-contain" /> : <Wrench className="size-10 text-primary" />}</span>
                <span className="mt-3 block line-clamp-2 min-h-10 text-xs font-bold">{related.name}</span>
                <span className="mt-2 block text-base font-black text-primary">{money(related.price)}</span>
                <span className="mt-1 block text-[11px] text-muted-foreground">{related.brand}</span>
              </button>
            ))}
          </div>
        </section>}
      </DialogContent>}
    </Dialog>
  );
}