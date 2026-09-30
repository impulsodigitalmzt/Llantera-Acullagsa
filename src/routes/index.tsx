import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BatteryCharging,
  CarFront,
  CircleDot,
  Clock3,
  Headphones,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShoppingCart as ShoppingCartIcon,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TireFinder } from "@/components/TireFinder";
import { ProductFinder } from "@/components/ProductFinder";
import { ShoppingCart, type CartItem } from "@/components/ShoppingCart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acullagsa | Llantera en Mazatlán: llantas y acumuladores" },
      { name: "description", content: "Baterías a domicilio, acumuladores LTH, llantas, instalación, balanceo y alineación en Mazatlán." },
      { property: "og:title", content: "Acullagsa | Energía y seguridad para tu camino" },
      { property: "og:description", content: "Encuentra la batería o llanta ideal para tu vehículo y solicita atención a domicilio en Mazatlán." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = [
  ["Inicio", "#inicio"], ["Llantas", "#llantas"], ["Acumuladores", "#acumuladores"],
  ["Amortiguadores", "#amortiguadores"], ["Servicios", "#servicios"], ["Contacto", "#contacto"],
];

type CatalogTab = "llantas" | "acumuladores" | "amortiguadores";

const catalogTabs: Array<{
  id: CatalogTab;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "llantas", label: "Llantas", icon: CircleDot },
  { id: "acumuladores", label: "Acumuladores LTH", icon: BatteryCharging },
  { id: "amortiguadores", label: "Amortiguadores", icon: Wrench },
];

function hashToTab(hash: string): CatalogTab | null {
  const id = hash.replace("#", "");
  if (id === "llantas" || id === "buscador") return "llantas";
  if (id === "acumuladores") return "acumuladores";
  if (id === "amortiguadores") return "amortiguadores";
  return null;
}

const serviceItems: Array<[LucideIcon, string]> = [
  [Wrench, "Instalación profesional"],
  [Sparkles, "Alineación por computadora"],
  [CarFront, "Montaje y balanceo"],
  [BatteryCharging, "Diagnóstico de batería"],
];

const benefits: Array<[LucideIcon, string, string]> = [
  [ShieldCheck, "Calidad / Precio", "Productos certificados, marcas reconocidas y el precio justo."],
  [Clock3, "Servicio eficiente", "Procesos enfocados en reducir tus tiempos de espera."],
  [Headphones, "Personal calificado", "Asesoría clara para elegir la mejor opción para tu vehículo."],
];

const lthLines = [
  { name: "El alma de tu automóvil", image: "lth-auto.png" },
  { name: "Lubricantes", image: "lth-lub.png" },
  { name: "Moto-Batería", image: "lth-moto.png" },
  { name: "Filtros", image: "lth-filtro.png" },
];

const tireBrands = [
  { name: "GOOD YEAR", image: "goodyear.png" },
  { name: "TORNEL", image: "tornel.png" },
  { name: "JK TYRE", image: "jktyre.png" },
  { name: "VIKRANT", image: "vikrant.png" },
  { name: "PACE", image: "pace.png" },
  { name: "TOLEDO", image: "toledo.png" },
];

function Brands() {
  return (
    <section id="marcas" className="bg-brand-soft py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-xs font-bold uppercase text-primary">Venta + instalación</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Nuestras Marcas</h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Acumuladores & Llantas</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Opciones para autos, camionetas, camiones y vehículos agrícolas. Te asesoramos para encontrar la medida adecuada.</p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-md bg-border sm:grid-cols-2 lg:grid-cols-4">
          {lthLines.map((item) => (
            <div key={item.name} className="flex min-h-32 items-center justify-center bg-background p-6">
              <img src={`/marcas/${item.image}`} alt={`LTH ${item.name}`} loading="lazy" className="h-16 w-full object-contain" />
            </div>
          ))}
        </div>
        <div className="mt-px grid gap-px overflow-hidden rounded-md bg-border sm:grid-cols-2 lg:grid-cols-6">
          {tireBrands.map((b) => (
            <div key={b.name} className="flex min-h-32 items-center justify-center bg-background p-4">
              <img src={`/marcas/${b.image}`} alt={b.name} loading="lazy" className="h-16 w-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <img
      src="/LOGO.png"
      alt="Acullagsa Acumuladores y Llantas"
      className={`${inverted ? "h-12" : "h-12"} w-auto max-w-[240px] object-contain object-left`}
    />
  );
}

function Header({ cartCount, onOpenCart }: { cartCount: number; onOpenCart: () => void }) {
  const [open, setOpen] = useState(false);
  return <>
    <div className="bg-brand-ink text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs">
        <span className="flex items-center gap-2"><MapPin className="size-3.5 text-primary" /> Servicio en Mazatlán, Sinaloa</span>
        <a href="tel:6699404388" className="hidden items-center gap-2 font-semibold sm:flex"><Phone className="size-3.5 text-primary" /> 669 940 4388</a>
      </div>
    </div>
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <a href="#inicio" aria-label="Acullagsa, inicio" className="flex items-center">
          <BrandLogo />
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
          {nav.map(([label, href]) => <a key={href} href={href} className="text-xs font-bold uppercase text-foreground transition-colors hover:text-primary">{label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" aria-label={`Abrir carrito, ${cartCount} artículos`} className="relative gap-2 px-3" onClick={onOpenCart}>
            <ShoppingCartIcon className="size-4" />
            <span className="hidden sm:inline">Carrito</span>
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground">{cartCount}</span>
          </Button>
          <Button asChild variant="hero" className="hidden sm:inline-flex"><a href="https://wa.me/526699402253" target="_blank" rel="noreferrer"><MessageCircle /> Cotizar</a></Button>
          <Button variant="ghost" size="icon" aria-label={open ? "Cerrar menú" : "Abrir menú"} className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {open && <nav className="border-t border-border bg-background px-4 py-3 lg:hidden">{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-border py-3 text-sm font-bold uppercase last:border-0">{label}</a>)}</nav>}
    </header>
  </>;
}

function CatalogHub({ onAddToCart }: { onAddToCart: (item: Omit<CartItem, "quantity">) => void }) {
  const [tab, setTab] = useState<CatalogTab>("llantas");

  useEffect(() => {
    const applyHash = () => {
      const next = hashToTab(window.location.hash);
      if (next) setTab(next);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const selectTab = (id: CatalogTab) => {
    setTab(id);
    const hash = `#${id}`;
    if (window.location.hash !== hash) {
      history.replaceState(null, "", hash);
    }
  };

  return (
    <section
      id="buscador"
      className="relative z-10 mx-auto max-w-6xl scroll-mt-28 px-4 -mt-24 pb-16 sm:-mt-28"
      aria-label="Catálogo de productos"
    >
      <span id="llantas" className="sr-only">Llantas</span>
      <span id="acumuladores" className="sr-only">Acumuladores LTH</span>
      <span id="amortiguadores" className="sr-only">Amortiguadores</span>

      <div
        role="tablist"
        aria-label="Categorías de producto"
        className="grid grid-cols-3 overflow-hidden rounded-t-md bg-brand-ink shadow-2xl ring-1 ring-border"
      >
        {catalogTabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={active}
              aria-controls={`panel-${id}`}
              onClick={() => selectTab(id)}
              className={`flex min-h-14 items-center justify-center gap-2 px-2 py-3 text-center text-[11px] font-black uppercase tracking-wide transition-colors sm:min-h-16 sm:px-4 sm:text-sm ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-brand-ink text-primary-foreground/70 hover:bg-brand-ink/80 hover:text-primary-foreground"
              }`}
            >
              <Icon className="hidden size-4 sm:block" />
              <span className="leading-tight">{label}</span>
            </button>
          );
        })}
      </div>

      {tab === "llantas" && (
        <div role="tabpanel" id="panel-llantas" aria-labelledby="tab-llantas">
          <TireFinder variant="hero" embedded onAddToCart={onAddToCart} />
        </div>
      )}

      {tab === "acumuladores" && (
        <div
          role="tabpanel"
          id="panel-acumuladores"
          aria-labelledby="tab-acumuladores"
          className="rounded-b-md bg-background p-5 shadow-2xl ring-1 ring-border md:p-7"
        >
          <div className="border-b border-border pb-6">
            <p className="text-xs font-bold uppercase text-primary">Potencia certificada</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Acumuladores LTH®</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">Una solución para cada vehículo, respaldada por asesoría especializada.</p>
          </div>
          <div className="mt-6">
            <ProductFinder category="acumuladores" onAddToCart={onAddToCart} />
          </div>
        </div>
      )}

      {tab === "amortiguadores" && (
        <div
          role="tabpanel"
          id="panel-amortiguadores"
          aria-labelledby="tab-amortiguadores"
          className="rounded-b-md bg-background p-5 shadow-2xl ring-1 ring-border md:p-7"
        >
          <div className="border-b border-border pb-6">
            <p className="text-xs font-bold uppercase text-primary">Suspensión</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Amortiguadores</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">Recupera la estabilidad y el confort de tu vehículo. Busca por marca, modelo y año.</p>
          </div>
          <div className="mt-8">
            <ProductFinder category="amortiguadores" onAddToCart={onAddToCart} />
          </div>
        </div>
      )}
    </section>
  );
}

function Index() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("acullagsa-cart-v1");
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item): item is CartItem =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.category === "string" &&
        typeof item.detail === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number",
      );
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    try {
      window.localStorage.setItem("acullagsa-cart-v1", JSON.stringify(cartItems));
    } catch {
      return;
    }
  }, [cartItems]);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      return existing
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCartItems((items) => quantity < 1
      ? items.filter((item) => item.id !== id)
      : items.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />
      <main>
        <section id="inicio" className="relative overflow-hidden bg-brand-ink">
          <img src="https://via.placeholder.com/1600x900?text=Hero" width={1600} height={900} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover object-[66%_center] opacity-25" />
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-14" />
        </section>
        <CatalogHub onAddToCart={addToCart} />

        <section id="servicios" className="bg-brand-ink py-20 text-primary-foreground"><div className="mx-auto max-w-6xl px-4"><div className="max-w-3xl"><p className="text-xs font-bold uppercase text-primary">Centro de servicio LTH</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">No solo vendemos.<br/>Te ponemos en marcha.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-primary-foreground/70">Contamos con equipo y personal capacitado para diagnosticar, instalar y cuidar tu vehículo con procesos confiables.</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{serviceItems.map(([Icon, label]) => <div key={label} className="flex items-center gap-3 border-b border-primary-foreground/15 pb-4 text-sm font-bold"><Icon className="size-5 text-primary" />{label}</div>)}</div><Button asChild size="xl" variant="hero" className="mt-8"><a href="tel:6699855424"><Phone /> Cotizar servicio</a></Button></div></div></section>

        <Brands />

        <section id="nosotros" className="mx-auto max-w-6xl px-4 py-20"><div className="text-center"><p className="text-xs font-bold uppercase text-primary">¿Por qué Acullagsa?</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Confianza que sí responde.</h2></div><div className="mt-12 grid gap-8 md:grid-cols-3">{benefits.map(([Icon,title,text]) => <div key={title} className="border-t-2 border-primary pt-6"><Icon className="size-9 text-primary" /><h3 className="mt-5 text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</div></section>

        <section id="contacto" className="bg-primary py-14 text-primary-foreground"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase">Atención rápida en Mazatlán</p><h2 className="mt-2 text-3xl font-black">¿Tu vehículo no enciende?</h2><p className="mt-2 text-sm text-primary-foreground/80">Escríbenos y te ayudamos a encontrar la batería correcta.</p></div><div className="flex flex-wrap gap-3"><Button asChild size="xl" variant="dark"><a href="https://wa.me/526699402253" target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button><Button asChild size="xl" variant="heroOutline"><a href="tel:6699404388"><Phone /> 669 940 4388</a></Button></div></div></section>
      </main>
      <footer className="bg-brand-ink py-12 text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-9 px-4 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <BrandLogo inverted />
            <p className="mt-5 max-w-sm text-xs leading-6 text-primary-foreground/60">Acumuladores, llantas y servicio especializado para mantener a Mazatlán en movimiento.</p>
          </div>
          <div>
            <h3 className="text-sm font-bold">Servicios</h3>
            <ul className="mt-4 space-y-3 text-xs text-primary-foreground/60">
              <li>Baterías a domicilio</li>
              <li>Venta e instalación de llantas</li>
              <li>Alineación y balanceo</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold">Contacto</h3>
            <div className="mt-4 space-y-3 text-xs text-primary-foreground/60">
              <a className="flex items-center gap-2 hover:text-primary-foreground" href="tel:6699404388"><Phone className="size-4 text-primary" />669 940 4388</a>
              <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" />Mazatlán, Sinaloa</span>
              <span className="flex items-center gap-2"><Truck className="size-4 text-primary" />Servicio a domicilio</span>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-primary-foreground/10 px-4 pt-6 text-[11px] text-primary-foreground/40">© 2026 Acullagsa. Todos los derechos reservados.</div>
      </footer>
      <a href="https://wa.me/526699402253" target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp" className="fixed bottom-5 right-5 z-50 flex size-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"><MessageCircle className="size-6" /></a>
      <ShoppingCart
        items={cartItems}
        open={cartOpen}
        onOpenChange={setCartOpen}
        onUpdateQuantity={updateCartQuantity}
        onRemove={(id) => setCartItems((items) => items.filter((item) => item.id !== id))}
        onClear={() => setCartItems([])}
      />
    </div>
  );
}