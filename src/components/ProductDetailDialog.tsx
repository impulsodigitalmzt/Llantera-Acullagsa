import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Banknote, Building2, ChevronLeft, ChevronRight, CreditCard, Minus, PackageSearch, Plus, ShoppingCart, Wrench, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/components/ShoppingCart";

export type ProductDetailProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  isBestSeller?: boolean;
  price: number;
  stockCount: number;
  gallery: string[];
  description: string;
  specifications: Array<{ label: string; value: string }>;
  cartItem: Omit<CartItem, "quantity">;
};

type ProductDetailPageProps = {
  product: ProductDetailProduct;
  products: ProductDetailProduct[];
  onBack: () => void;
  onSelectProduct: (product: ProductDetailProduct) => void;
  onAddToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
};

const money = (amount: number) => `$ ${amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

export function ProductDetailPage({ product, products, onBack, onSelectProduct, onAddToCart }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const relatedRail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuantity(1);
    setImageIndex(0);
    setZoomed(false);
  }, [product?.id]);

  const image = product.gallery[imageIndex];
  const relatedProducts = useMemo(() => products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .sort((a, b) => Number(b.brand === product.brand) - Number(a.brand === product.brand)), [products, product]);

  return (
    <div className="min-h-[70vh] bg-background">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Volver al catálogo</button>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.9fr)]">
            <section className="grid min-w-0 gap-3 md:grid-cols-[64px_minmax(0,1fr)]" aria-label="Galería del producto">
              <div className="order-2 flex gap-2 overflow-x-auto pb-1 md:order-1 md:flex-col md:overflow-x-visible" aria-label="Imágenes del producto">
                {product.gallery.length ? product.gallery.map((src, index) => (
                  <button key={`${src}-${index}`} type="button" aria-label={`Ver imagen ${index + 1} de ${product.name}`} aria-pressed={imageIndex === index} onClick={() => { setImageIndex(index); setZoomed(false); }} className={`flex size-14 shrink-0 items-center justify-center border p-1 sm:size-16 ${imageIndex === index ? "border-primary" : "border-border"}`}>
                    <img src={src} alt="" className="size-full object-contain" />
                  </button>
                )) : <span className="flex size-14 shrink-0 items-center justify-center border border-primary text-primary sm:size-16"><Wrench className="size-6" /></span>}
              </div>
              <div className="relative order-1 flex aspect-square min-h-0 items-center justify-center overflow-hidden bg-white p-3 md:order-2 md:aspect-[4/3] md:p-6">
                {image ? <button type="button" aria-label={zoomed ? "Reducir imagen" : "Ampliar imagen"} onClick={() => setZoomed((value) => !value)} className="flex size-full cursor-zoom-in items-center justify-center overflow-hidden" onDoubleClick={() => setZoomed(false)}>
                  <img src={image} alt={`${product.name}, imagen ${imageIndex + 1}`} className={`size-full object-contain transition-transform duration-300 ${zoomed ? "scale-150 cursor-zoom-out" : "scale-100"}`} />
                </button> : <Wrench className="size-24 text-primary" />}
                <button type="button" onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? "Reducir imagen" : "Ampliar imagen"} className="absolute bottom-3 right-3 flex size-10 items-center justify-center border border-border bg-background/95 shadow-sm">
                  {zoomed ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
                </button>
              </div>
            </section>

            <section className="min-w-0">
              <p className="text-xs font-bold uppercase text-primary">{product.category} · {product.brand}</p>
              {product.isBestSeller && <span className="mt-3 inline-flex bg-primary px-2 py-1 text-[11px] font-black uppercase text-primary-foreground">Más vendido</span>}
              <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{product.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">Código de producto: <span className="font-semibold text-foreground">{product.sku}</span></p>
              <p className="mt-4 text-sm font-bold">Características principales</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-5 text-muted-foreground">
                {product.specifications.slice(0, 5).map(({ label, value }) => <li key={label}><span className="font-semibold text-foreground">{label}:</span> {value}</li>)}
              </ul>
              <button type="button" onClick={() => document.getElementById("caracteristicas-producto")?.scrollIntoView({ behavior: "smooth" })} className="mt-4 text-sm font-semibold text-primary hover:underline">Ver todas las características</button>
            </section>
          </div>
          <section className="mt-1 border-t border-border pt-5" aria-labelledby="descripcion-producto">
            <h2 id="descripcion-producto" className="text-xl font-black">Descripción</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{product.description}</p>
          </section>

          <aside className="h-fit border border-border p-5">
            <p className="text-3xl font-black text-primary">{money(product.price)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Precio con IVA incluido</p>
            <p className={`mt-5 flex items-center gap-2 text-sm font-bold ${product.stockCount > 0 ? "text-foreground" : "text-muted-foreground"}`}>
              <span className={`size-2 rounded-full ${product.stockCount > 0 ? "bg-green-600" : "bg-muted-foreground"}`} />
              {product.stockCount > 0 ? `En stock: ${product.stockCount} disponibles` : "Sin stock; cotiza disponibilidad"}
            </p>
            <div className="mt-5 flex h-11 w-fit items-center border border-border" aria-label="Cantidad">
              <button type="button" aria-label="Reducir cantidad" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex size-10 items-center justify-center disabled:opacity-40"><Minus className="size-4" /></button>
              <span className="min-w-9 text-center text-sm font-bold" aria-live="polite">{quantity}</span>
              <button type="button" aria-label="Aumentar cantidad" onClick={() => setQuantity((value) => Math.min(99, value + 1))} className="flex size-10 items-center justify-center"><Plus className="size-4" /></button>
            </div>
            <Button variant="dark" className="mt-4 h-11 w-full" onClick={() => onAddToCart(product.cartItem, quantity)}><ShoppingCart /> {product.stockCount > 0 ? "Añadir al carrito" : "Cotizar"}</Button>
            <div className="mt-6 border-t border-border pt-5">
              <h2 className="text-sm font-black">Vendido por Acullagsa</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Atención en Mazatlán, Sinaloa. Disponibilidad y entrega se confirman al solicitar tu pedido.</p>
            </div>
            <div className="mt-5 border-t border-border pt-5">
              <h2 className="text-sm font-black">Medios de pago</h2>
              <ul className="mt-3 space-y-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><Banknote className="size-4 text-primary" /> Efectivo en sucursal o al recibir</li>
                <li className="flex items-center gap-2"><CreditCard className="size-4 text-primary" /> Tarjeta con terminal</li>
                <li className="flex items-center gap-2"><Building2 className="size-4 text-primary" /> Transferencia bancaria</li>
              </ul>
              <p className="mt-3 text-[11px] text-muted-foreground">El método y las condiciones se confirman al finalizar el pedido.</p>
            </div>
          </aside>
        </div>

        {relatedProducts.length > 0 && <section className="mt-10 border-t border-border pt-7">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-lg font-black"><PackageSearch className="size-5 text-primary" /> También puede interesarte</h3>
            <div className="flex shrink-0 gap-1">
              <button type="button" aria-label="Productos relacionados anteriores" onClick={() => relatedRail.current?.scrollBy({ left: -260, behavior: "smooth" })} className="flex size-9 items-center justify-center border border-border hover:bg-muted"><ChevronLeft className="size-4" /></button>
              <button type="button" aria-label="Más productos relacionados" onClick={() => relatedRail.current?.scrollBy({ left: 260, behavior: "smooth" })} className="flex size-9 items-center justify-center border border-border hover:bg-muted"><ChevronRight className="size-4" /></button>
            </div>
          </div>
          <div ref={relatedRail} className="mt-4 grid auto-cols-[minmax(190px,240px)] grid-flow-col gap-3 overflow-x-auto pb-3 [scroll-snap-type:x_mandatory]">
            {relatedProducts.slice(0, 8).map((related) => (
              <button key={related.id} type="button" onClick={() => { onSelectProduct(related); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="min-w-0 border border-border p-3 text-left transition-colors hover:border-primary [scroll-snap-align:start]">
                <span className="flex aspect-[4/3] items-center justify-center bg-muted/30 p-2">{related.gallery[0] ? <img src={related.gallery[0]} alt="" className="size-full object-contain" /> : <Wrench className="size-10 text-primary" />}</span>
                <span className="mt-3 block line-clamp-2 min-h-10 text-xs font-bold">{related.name}</span>
                <span className="mt-2 block text-base font-black text-primary">{money(related.price)}</span>
                <span className="mt-1 block text-[11px] text-muted-foreground">{related.brand}</span>
              </button>
            ))}
          </div>
        </section>}
        <section id="caracteristicas-producto" className="mt-8 max-w-4xl border-t border-border pt-7">
          <h2 className="text-xl font-black">Características del producto</h2>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {product.specifications.map(({ label, value }) => <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 py-3 text-sm"><dt className="text-muted-foreground">{label}</dt><dd className="font-semibold">{value}</dd></div>)}
          </dl>
        </section>
      </div>
    </div>
  );
}