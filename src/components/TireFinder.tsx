import { useMemo, useRef, useState } from "react";
import { CarFront, ChevronLeft, ChevronRight, Eye, Ruler, Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductDetailProduct } from "@/components/ProductDetailDialog";
import { ProductQuickView } from "@/components/ProductQuickView";
import tireImg from "@/assets/tire.jpg";
import type { CartItem } from "@/components/ShoppingCart";

type Tire = { brand: string; model: string; size: string; load: string; price: number; list: number; stock: boolean };

function toTireDetail(tire: Tire): ProductDetailProduct {
  const id = `tire-${tire.brand}-${tire.model}-${tire.size}`;
  const stockCount = tire.stock ? 6 + hash(`${tire.brand}${tire.size}`) % 18 : 0;
  const [, dimensions = ""] = tire.size.split("/");
  const [profile = "", rim = ""] = dimensions.split("R");
  const sectionWidth = tire.size.split("/")[0] ?? "Consultar";
  const loadIndex = tire.load.slice(0, -1);
  const speedRating = tire.load.slice(-1);
  const terrain = /\bAT\b|GRABBER/i.test(tire.model) ? "todo terreno (A/T)" : "carretera";
  const description = [
    `${tire.brand} ${tire.model} es una llanta radial en medida ${tire.size}, con ancho nominal de sección de ${sectionWidth} mm, relación de aspecto ${profile} y diámetro de rin de ${rim} pulgadas. Esta combinación identifica las dimensiones principales que deben coincidir con las indicadas por el fabricante del vehículo.`,
    `Su índice de carga es ${loadIndex} y su código de velocidad es ${speedRating}. Estos índices forman parte de la especificación de la llanta y deben compararse con la etiqueta de presión o el manual del vehículo. El modelo se clasifica para uso de ${terrain}; revisa que ese uso corresponda a tus recorridos y a la aplicación recomendada.`,
    `La publicación corresponde a una unidad. Antes de instalarla, verifica medida, rin, índices, espacio disponible y compatibilidad con las otras llantas del vehículo. La presión correcta y la carga máxima dependen del vehículo y no deben determinarse únicamente con el nombre comercial de la llanta.`,
  ].join("\n\n");
  return {
    id,
    name: `${tire.brand} ${tire.model}`,
    brand: tire.brand,
    category: "Llanta",
    sku: `${tire.size}-${tire.brand.replaceAll(" ", "-")}`,
    price: tire.price,
    stockCount,
    gallery: [tireImg],
    description,
    specifications: [
      { label: "Medida", value: tire.size },
      { label: "Ancho de sección", value: `${sectionWidth} mm` },
      { label: "Relación de aspecto", value: profile },
      { label: "Diámetro del rin", value: `${rim} pulgadas` },
      { label: "Índice de carga", value: loadIndex },
      { label: "Índice de velocidad", value: speedRating },
      { label: "Construcción", value: "Radial" },
      { label: "Cantidad de llantas", value: "1" },
      { label: "Tipo de servicio", value: "Consultar aplicación" },
      { label: "Tipo de terreno", value: terrain },
      { label: "Disponibilidad", value: stockCount ? `${stockCount} unidades` : "Sobre pedido" },
    ],
    cartItem: {
      id,
      name: `${tire.brand} ${tire.model}`,
      category: "Llanta",
      detail: `${tire.size} · Índice ${tire.load} · ${tire.stock ? "En existencia" : "Sobre pedido"}`,
      price: tire.price,
      image: tireImg,
    },
  };
}

const BRANDS = ["GOODYEAR", "TORNEL", "JK TYRE", "TOLEDO TYRES", "EUZKADI", "GENERAL TIRE"];
const BRAND_LOGOS: Record<string, string> = {
  GOODYEAR: "/marcas/goodyear.png",
  TORNEL: "/marcas/tornel.png",
  "JK TYRE": "/marcas/jktyre.png",
  "TOLEDO TYRES": "/marcas/toledo.png",
};
const MODELS: Record<string, string[]> = {
  GOODYEAR: ["Assurance Maxlife", "EfficientGrip", "Wrangler Workhorse"],
  TORNEL: ["Real", "Astral", "AT-09"],
  "JK TYRE": ["Vectra", "Ux Royale", "Blazze"],
  "TOLEDO TYRES": ["TL1000", "TL3000", "TL6000 AT"],
  EUZKADI: ["Eurodrive", "Eurotrek"],
  "GENERAL TIRE": ["Altimax RT43", "Grabber AT3"],
};

const SIZES = [
  "155/80R13", "175/70R13", "175/65R14", "185/60R14", "185/65R14", "185/55R15", "185/65R15",
  "195/65R15", "195/55R16", "205/55R16", "215/60R16", "215/55R17", "225/65R17", "235/65R17",
  "245/70R16", "265/70R16", "265/65R17", "225/45R18", "235/60R18", "265/70R17",
];

function hash(s: string) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

// Catálogo demostrativo generado de forma determinista
const CATALOG: Tire[] = SIZES.flatMap((size) => {
  const rin = Number(size.split("R")[1]);
  return BRANDS.filter((b) => hash(size + b) % 4 !== 0).map((brand) => {
    const models = MODELS[brand]!;
    const h = hash(brand + size);
    const price = Math.round((900 + rin * 90 + (h % 900)) / 10) * 10 - 1;
    return {
      brand, model: models[h % models.length]!, size,
      load: `${80 + (h % 25)}${["H", "T", "V"][h % 3]}`,
      price, list: Math.round(price * 1.3), stock: h % 5 !== 0,
    };
  });
});

import { VEHICLES, YEARS } from "@/data/catalog";

const parse = (s: string) => { const [w = "", rest = ""] = s.split("/"); const [p = "", r = ""] = rest.split("R"); return { w, p, r }; };
const uniq = (a: string[]) => [...new Set(a)].sort((x, y) => Number(x) - Number(y));
const money = (n: number) => `$ ${n.toLocaleString("es-MX")}.00`;

export function TireFinder({ variant = "card", embedded = false, onAddToCart, onOpenProduct }: {
  variant?: "hero" | "card";
  embedded?: boolean;
  onAddToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  onOpenProduct: (product: ProductDetailProduct, products: ProductDetailProduct[]) => void;
}) {
  const [mode, setMode] = useState<"size" | "vehicle">("size");
  const [w, setW] = useState(""); const [p, setP] = useState(""); const [r, setR] = useState("");
  const [make, setMake] = useState(""); const [model, setModel] = useState(""); const [year, setYear] = useState("");
  const [result, setResult] = useState<{ size: string; label: string } | null>(null);
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [onlyStock, setOnlyStock] = useState(false);
  const [sort, setSort] = useState("relevance");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<ProductDetailProduct | null>(null);

  const parsed = SIZES.map(parse);
  const widths = uniq(parsed.map((x) => x.w));
  const profiles = uniq(parsed.filter((x) => x.w === w).map((x) => x.p));
  const rins = uniq(parsed.filter((x) => x.w === w && x.p === p).map((x) => x.r));
  const vehicleSize = make && model ? VEHICLES[make]?.[model]?.tire ?? "" : "";

  const canSearch = mode === "size" ? w && p && r : make && model && year;
  const preview = mode === "size" ? (w && p && r ? `${w}/${p}R${r}` : "") : vehicleSize;

  const search = () => {
    if (!canSearch || !preview) return;
    setBrandFilter([]); setOnlyStock(false); setMinPrice(""); setMaxPrice("");
    setResult({ size: preview, label: mode === "vehicle" ? `Medida de fábrica: ${make} ${model} ${year}` : `Medida ${preview}` });
    setTimeout(() => document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const matches = useMemo(() => result ? CATALOG.filter((t) => t.size === result.size) : [], [result]);
  const shown = useMemo(() => matches
    .filter((t) => !brandFilter.length || brandFilter.includes(t.brand))
    .filter((t) => !onlyStock || t.stock)
    .filter((t) => !minPrice || t.price >= Number(minPrice))
    .filter((t) => !maxPrice || t.price <= Number(maxPrice))
    .sort((a, b) => sort === "asc" ? a.price - b.price : sort === "desc" ? b.price - a.price : Number(b.stock) - Number(a.stock)), [matches, brandFilter, onlyStock, minPrice, maxPrice, sort]);
  const detailProducts = useMemo(() => matches.map(toTireDetail), [matches]);

  const sel = "h-12 w-full min-w-0 rounded-md border border-input bg-background px-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 sm:px-3 sm:text-sm";
  const field = "flex min-w-0 flex-col gap-2 text-xs font-bold";
  const formGrid = "mt-4 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_160px]";
  const tab = (active: boolean) => `flex items-center gap-2 px-4 py-3 text-sm font-bold ${active ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`;
  const [isDragging, setIsDragging] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dragState = useRef<{ startX: number; scrollLeft: number } | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollCarousel = (direction: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("article")?.getBoundingClientRect().width ?? 280;
    const scrollAmount = direction * (cardWidth + 16);
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    const nextIndex = Math.max(0, Math.min(shown.length - 1, activeSlide + direction));
    setActiveSlide(nextIndex);
  };

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el || !shown.length) return;
    const cardWidth = el.querySelector("article")?.getBoundingClientRect().width ?? 280;
    const center = el.scrollLeft + el.clientWidth / 2;
    const index = Math.round(center / (cardWidth + 16));
    setActiveSlide(Math.max(0, Math.min(shown.length - 1, index)));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    dragState.current = { startX: event.clientX, scrollLeft: el.scrollLeft };
    setIsDragging(true);
    el.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const el = event.currentTarget;
    const delta = event.clientX - dragState.current.startX;
    el.scrollLeft = dragState.current.scrollLeft - delta;
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragState.current = null;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const card = (
      <div className={`overflow-hidden bg-background shadow-2xl ring-1 ring-border ${embedded ? "rounded-b-md rounded-t-none" : "rounded-md"}`}>
        <div className="grid items-stretch md:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0 p-4 sm:p-5">
            {variant === "hero"
              ? <h1 className="text-xl font-black sm:text-2xl">Busca por medida o por vehículo</h1>
              : <h2 className="text-xl font-black sm:text-2xl">Encuentra la llanta exacta para tu vehículo</h2>}
            <p className="mt-1 text-sm text-muted-foreground">{variant === "hero" ? "Captura la medida que trae tu llanta o dinos qué auto tienes y te mostramos las compatibles." : "Busca por la medida que trae tu llanta, o dinos qué auto tienes y te decimos cuál le va."}</p>
            <div className="mt-4 flex border-b border-border">
              <button type="button" className={tab(mode === "size")} onClick={() => setMode("size")}><Ruler className="size-4" /> Por medida</button>
              <button type="button" className={tab(mode === "vehicle")} onClick={() => setMode("vehicle")}><CarFront className="size-4" /> Por vehículo</button>
            </div>
            {mode === "size" ? (
              <div className={formGrid}>
                <label className={field}>Ancho<select className={sel} value={w} onChange={(e) => { setW(e.target.value); setP(""); setR(""); }}><option value="">Ancho</option>{widths.map((x) => <option key={x}>{x}</option>)}</select></label>
                <label className={field}>Perfil<select className={sel} disabled={!w} value={p} onChange={(e) => { setP(e.target.value); setR(""); }}><option value="">Perfil</option>{profiles.map((x) => <option key={x}>{x}</option>)}</select></label>
                <label className={field}>Rin<select className={sel} disabled={!p} value={r} onChange={(e) => setR(e.target.value)}><option value="">Rin</option>{rins.map((x) => <option key={x} value={x}>R{x}</option>)}</select></label>
                <Button size="xl" variant="hero" disabled={!canSearch} className="col-span-3 h-12 w-full self-end justify-center whitespace-nowrap px-3 lg:col-span-1" onClick={search}><Search /> Ver llantas</Button>
              </div>
            ) : (
              <div className={formGrid}>
                <label className={field}>Marca<select className={sel} value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }}><option value="">Marca</option>{Object.keys(VEHICLES).map((x) => <option key={x}>{x}</option>)}</select></label>
                <label className={field}>Modelo<select className={sel} disabled={!make} value={model} onChange={(e) => setModel(e.target.value)}><option value="">Modelo</option>{make && Object.keys(VEHICLES[make] ?? {}).map((x) => <option key={x}>{x}</option>)}</select></label>
                <label className={field}>Año<select className={sel} disabled={!model} value={year} onChange={(e) => setYear(e.target.value)}><option value="">Año</option>{YEARS.map((x) => <option key={x}>{x}</option>)}</select></label>
                <Button size="xl" variant="hero" disabled={!canSearch} className="col-span-3 h-12 w-full self-end justify-center whitespace-nowrap px-3 lg:col-span-1" onClick={search}><Search /> Ver llantas</Button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center border-t border-border bg-white p-2 md:border-l md:border-t-0">
            <img src="/llantas/medida_llantas.png" alt="Guía visual para identificar ancho, perfil y rin en el costado de una llanta" className="h-auto max-h-36 w-full object-contain md:max-h-40" />
          </div>
        </div>
      </div>
  );

  const results = result ? (
      <section id="resultados" className={`scroll-mt-28 ${embedded ? "pt-10" : "mx-auto max-w-6xl px-4 pt-14"}`}>
        <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase text-primary">{result.label}</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Llantas {result.size}</h2></div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm"><span className="text-muted-foreground">{shown.length} de {matches.length} productos</span>
            <label className="flex items-center gap-2 font-semibold">Ordenar por<select aria-label="Ordenar productos" value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3"><option value="relevance">Relevancia</option><option value="asc">Precio, menor a mayor</option><option value="desc">Precio, mayor a menor</option></select></label></div>
        </div>
        <div className="mt-4 lg:mt-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
          <aside className="hidden lg:block lg:rounded-xl lg:border lg:border-border lg:bg-muted/20 lg:p-3 lg:text-sm lg:shadow-sm lg:pr-6">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
              <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-foreground"><SlidersHorizontal className="size-3.5" /> Filtros</p>
              <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{matches.length}</span>
            </div>
            <div className="space-y-3 pt-3 lg:space-y-5">
              <div>
                <p className="border-b border-border pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Disponibilidad</p>
                <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} className="accent-primary" /> En existencia <span className="ml-auto text-xs text-muted-foreground">{matches.filter((t) => t.stock).length}</span></label>
              </div>
              <div>
                <p className="border-b border-border pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Precio</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <label className="text-[11px] text-muted-foreground">Mínimo<input inputMode="numeric" type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="$0" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground" /></label>
                  <label className="text-[11px] text-muted-foreground">Máximo<input inputMode="numeric" type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Sin límite" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground" /></label>
                </div>
              </div>
              <div>
                <p className="border-b border-border pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Marca</p>
                <div className="mt-2 space-y-2">
                  {[...new Set(matches.map((t) => t.brand))].map((b) => <label key={b} className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" checked={brandFilter.includes(b)} onChange={(e) => setBrandFilter(e.target.checked ? [...brandFilter, b] : brandFilter.filter((x) => x !== b))} /> {b}<span className="ml-auto text-xs text-muted-foreground">{matches.filter((t) => t.brand === b).length}</span></label>)}
                </div>
              </div>
            </div>
          </aside>
          <div className="lg:hidden">
            <div className="relative mb-3 flex items-center justify-end">
              <button type="button" aria-label="Abrir filtros" onClick={() => setIsFilterOpen((open) => !open)} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-foreground shadow-sm"><SlidersHorizontal className="size-3.5" /> Filtros</button>
            </div>
            {isFilterOpen && (
              <div className="mb-4 rounded-xl border border-border bg-muted/20 p-3 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <p className="border-b border-border pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Disponibilidad</p>
                    <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} className="accent-primary" /> En existencia <span className="ml-auto text-xs text-muted-foreground">{matches.filter((t) => t.stock).length}</span></label>
                  </div>
                  <div>
                    <p className="border-b border-border pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Precio</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <label className="text-[11px] text-muted-foreground">Mínimo<input inputMode="numeric" type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="$0" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground" /></label>
                      <label className="text-[11px] text-muted-foreground">Máximo<input inputMode="numeric" type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Sin límite" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground" /></label>
                    </div>
                  </div>
                  <div>
                    <p className="border-b border-border pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Marca</p>
                    <div className="mt-2 space-y-2">{[...new Set(matches.map((t) => t.brand))].map((b) => <label key={b} className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" checked={brandFilter.includes(b)} onChange={(e) => setBrandFilter(e.target.checked ? [...brandFilter, b] : brandFilter.filter((x) => x !== b))} /> {b}<span className="ml-auto text-xs text-muted-foreground">{matches.filter((t) => t.brand === b).length}</span></label>)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {shown.length ? (
            <div className="relative">
              <div className="absolute -left-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-background/90 p-2 shadow-sm backdrop-blur-sm md:flex">
                <button type="button" aria-label="Anterior" onClick={() => scrollCarousel(-1)} className="flex size-8 items-center justify-center rounded-full text-foreground transition hover:bg-muted"><ChevronLeft className="size-4" /></button>
              </div>
              <div className="absolute -right-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-background/90 p-2 shadow-sm backdrop-blur-sm md:flex">
                <button type="button" aria-label="Siguiente" onClick={() => scrollCarousel(1)} className="flex size-8 items-center justify-center rounded-full text-foreground transition hover:bg-muted"><ChevronRight className="size-4" /></button>
              </div>
              <div ref={carouselRef} className="flex gap-3 overflow-x-auto pb-3 pl-1 pr-1 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-3" style={{ scrollSnapType: "x proximity", WebkitOverflowScrolling: "touch", touchAction: "pan-y", cursor: isDragging ? "grabbing" : "grab", userSelect: "none" }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onPointerCancel={onPointerUp} onScroll={handleCarouselScroll}>
                {shown.map((t) => {
                  const off = Math.round((1 - t.price / t.list) * 100);
                  const detail = toTireDetail(t);
                  return <article key={t.brand + t.model} role="button" tabIndex={0} onClick={() => onOpenProduct(detail, detailProducts)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onOpenProduct(detail, detailProducts); } }} className="group/card flex min-w-[62%] max-w-[62%] snap-start cursor-pointer flex-col rounded-xl border border-border bg-card p-2.5 text-center shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-w-0 sm:max-w-none sm:rounded-lg">
                    <div className="relative rounded-lg bg-muted/40 p-2"><span className="absolute left-2 top-2 rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">-{off}%</span>
                      <div className="flex h-4 items-center justify-center">{BRAND_LOGOS[t.brand] ? <img src={BRAND_LOGOS[t.brand]} alt={`Logo ${t.brand}`} className="max-h-4 max-w-20 object-contain" /> : <span className="text-[11px] font-black italic text-primary">{t.brand}</span>}</div>
                      <div className="relative mx-auto mt-2 w-32 sm:w-full"><img src={tireImg} alt={`Llanta ${t.brand} ${t.model} ${t.size}`} width={816} height={816} loading="lazy" className="aspect-square w-full object-contain" /><Button variant="hero" size="sm" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover/card:pointer-events-auto group-hover/card:opacity-100 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100" onClick={(event) => { event.stopPropagation(); setQuickViewProduct(detail); }}><Eye /> Vista rápida</Button></div></div>
                    <div className="mt-2 flex min-h-[105px] flex-col"><h3 className="text-[11px] font-black uppercase leading-tight">{t.brand} {t.model}</h3><p className="mt-1 text-[10px] font-bold text-muted-foreground">{t.size} · {t.load}</p><p className="mt-1 text-[10px] text-muted-foreground line-through">{money(t.list)}</p><p className="text-lg font-black tracking-tight text-primary">{money(t.price)}</p><p className="text-[9px] text-muted-foreground">IVA incluido</p><p className={`mt-1 text-[10px] font-semibold ${t.stock ? "text-foreground" : "text-muted-foreground"}`}>{t.stock ? "En existencia" : "Sobre pedido"}</p></div>
                    <Button variant="dark" className="mt-auto h-9 w-full text-[10px]" onClick={(event) => { event.stopPropagation(); onAddToCart({ id: `tire-${t.brand}-${t.model}-${t.size}`, name: `${t.brand} ${t.model}`, category: "Llanta", detail: `${t.size} · Índice ${t.load} · ${t.stock ? "En existencia" : "Sobre pedido"}`, price: t.price, image: tireImg, }); }}><ShoppingCart className="size-3.5" /> {t.stock ? "Añadir" : "Cotizar"}</Button>
                  </article>;
                })}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 md:hidden">{shown.map((_, index) => <button key={index} type="button" aria-label={`Ir a tarjeta ${index + 1}`} onClick={() => { const el = carouselRef.current; if (!el) return; const card = el.querySelectorAll("article")[index]; card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" }); setActiveSlide(index); }} className={`h-2 rounded-full transition-all ${index === activeSlide ? "w-7 bg-primary" : "w-2 bg-border"}`} />)}</div>
            </div>
          ) : <p className="rounded-md bg-brand-soft p-6 text-sm">No hay llantas con esos filtros. Escríbenos por WhatsApp y la conseguimos.</p>}
        </div>
      </section>
  ) : null;

  if (embedded) return <>{card}{results}<ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={onAddToCart} /></>;

  return <>
    <div id="buscador" className={`relative z-10 mx-auto max-w-6xl scroll-mt-28 px-4 ${variant === "hero" ? "-mt-24 sm:-mt-28" : "-mt-20"}`}>
      {card}
    </div>
    {results}
    <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={onAddToCart} />
  </>;
}
