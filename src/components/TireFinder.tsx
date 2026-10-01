import { useMemo, useState } from "react";
import { CarFront, Eye, Ruler, Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDetailDialog, type ProductDetailProduct } from "@/components/ProductDetailDialog";
import tireImg from "@/assets/tire.jpg";
import type { CartItem } from "@/components/ShoppingCart";

type Tire = { brand: string; model: string; size: string; load: string; price: number; list: number; stock: boolean };

function toTireDetail(tire: Tire): ProductDetailProduct {
  const id = `tire-${tire.brand}-${tire.model}-${tire.size}`;
  const stockCount = tire.stock ? 6 + hash(`${tire.brand}${tire.size}`) % 18 : 0;
  return {
    id,
    name: `${tire.brand} ${tire.model}`,
    brand: tire.brand,
    category: "Llanta",
    sku: `${tire.size}-${tire.brand.replaceAll(" ", "-")}`,
    price: tire.price,
    stockCount,
    gallery: [tireImg],
    description: `Llanta ${tire.brand} ${tire.model} en medida ${tire.size}, diseñada para ofrecer desempeño y agarre confiables. Verifica la compatibilidad con las especificaciones de tu vehículo antes de instalar.`,
    specifications: [
      { label: "Medida", value: tire.size },
      { label: "Índice de carga", value: tire.load.slice(0, -1) },
      { label: "Código de velocidad", value: tire.load.slice(-1) },
      { label: "Construcción", value: "Radial" },
      { label: "Rin", value: tire.size.split("R")[1] ?? "Consultar" },
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

export function TireFinder({ variant = "card", embedded = false, onAddToCart }: {
  variant?: "hero" | "card";
  embedded?: boolean;
  onAddToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
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
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailProduct | null>(null);

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
  const relatedProducts = selectedProduct
    ? detailProducts.filter((item) => item.id !== selectedProduct.id)
      .sort((a, b) => Number(b.brand === selectedProduct.brand) - Number(a.brand === selectedProduct.brand))
    : [];

  const sel = "h-12 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";
  const field = "flex min-w-0 flex-col gap-2 text-xs font-bold";
  const formGrid = "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]";
  const tab = (active: boolean) => `flex items-center gap-2 px-4 py-3 text-sm font-bold ${active ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`;

  const card = (
      <div className={`overflow-hidden bg-background shadow-2xl ring-1 ring-border ${embedded ? "rounded-b-md rounded-t-none" : "rounded-md"}`}>
        <div className="p-5 md:p-7">
          {variant === "hero"
            ? <h1 className="text-xl font-black sm:text-2xl">Busca por medida o por vehículo</h1>
            : <h2 className="text-xl font-black sm:text-2xl">Encuentra la llanta exacta para tu vehículo</h2>}
          <p className="mt-1 text-sm text-muted-foreground">{variant === "hero" ? "Captura la medida que trae tu llanta o dinos qué auto tienes y te mostramos las compatibles." : "Busca por la medida que trae tu llanta, o dinos qué auto tienes y te decimos cuál le va."}</p>
          <div className="mt-4 flex border-b border-border">
            <button className={tab(mode === "size")} onClick={() => setMode("size")}><Ruler className="size-4" /> Por medida</button>
            <button className={tab(mode === "vehicle")} onClick={() => setMode("vehicle")}><CarFront className="size-4" /> Por vehículo</button>
          </div>
          {mode === "size" ? (
            <div className={formGrid}>
              <label className={field}>Ancho<select className={sel} value={w} onChange={(e) => { setW(e.target.value); setP(""); setR(""); }}><option value="">Ancho</option>{widths.map((x) => <option key={x}>{x}</option>)}</select></label>
              <label className={field}>Perfil<select className={sel} disabled={!w} value={p} onChange={(e) => { setP(e.target.value); setR(""); }}><option value="">Perfil</option>{profiles.map((x) => <option key={x}>{x}</option>)}</select></label>
              <label className={field}>Rin<select className={sel} disabled={!p} value={r} onChange={(e) => setR(e.target.value)}><option value="">Rin</option>{rins.map((x) => <option key={x} value={x}>R{x}</option>)}</select></label>
              <Button size="xl" variant="hero" disabled={!canSearch} className="h-12 w-full self-end justify-center whitespace-nowrap" onClick={search}><Search /> Ver llantas</Button>
            </div>
          ) : (
            <div className={formGrid}>
              <label className={field}>Marca<select className={sel} value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }}><option value="">Marca</option>{Object.keys(VEHICLES).map((x) => <option key={x}>{x}</option>)}</select></label>
              <label className={field}>Modelo<select className={sel} disabled={!make} value={model} onChange={(e) => setModel(e.target.value)}><option value="">Modelo</option>{make && Object.keys(VEHICLES[make] ?? {}).map((x) => <option key={x}>{x}</option>)}</select></label>
              <label className={field}>Año<select className={sel} disabled={!model} value={year} onChange={(e) => setYear(e.target.value)}><option value="">Año</option>{YEARS.map((x) => <option key={x}>{x}</option>)}</select></label>
              <Button size="xl" variant="hero" disabled={!canSearch} className="h-12 w-full self-end justify-center whitespace-nowrap" onClick={search}><Search /> Ver llantas {canSearch ? preview : ""}</Button>
            </div>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md bg-brand-soft px-4 py-3">
            <p className="text-2xl font-black text-primary">{preview ? preview.replace("R", " R") : "—/— R—"}</p>
            <div>
              <p className="text-sm font-bold">{mode === "vehicle" && vehicleSize ? `Medida de fábrica: ${make} ${model}` : "Elige ancho, perfil y rin."}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">La medida viene en el costado de tu llanta, por ejemplo 205/55R16.</p>
            </div>
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
        <div className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="space-y-6 border-b border-border pb-5 text-sm lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"><SlidersHorizontal className="size-4" /> Filtros</p>
            <div><p className="border-b border-border pb-2 text-xs font-black uppercase tracking-widest">Disponibilidad</p>
              <label className="mt-3 flex items-center gap-2"><input type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} className="accent-primary" /> En existencia <span className="ml-auto text-xs text-muted-foreground">{matches.filter((t) => t.stock).length}</span></label></div>
            <div><p className="border-b border-border pb-2 text-xs font-black uppercase tracking-widest">Precio</p>
              <div className="mt-3 grid grid-cols-2 gap-2"><label className="text-xs text-muted-foreground">Mínimo<input inputMode="numeric" type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="$0" className="mt-1 h-10 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground" /></label><label className="text-xs text-muted-foreground">Máximo<input inputMode="numeric" type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Sin límite" className="mt-1 h-10 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground" /></label></div></div>
            <div><p className="border-b border-border pb-2 text-xs font-black uppercase tracking-widest">Marca</p>
              {[...new Set(matches.map((t) => t.brand))].map((b) => <label key={b} className="mt-3 flex items-center gap-2"><input type="checkbox" className="accent-primary" checked={brandFilter.includes(b)} onChange={(e) => setBrandFilter(e.target.checked ? [...brandFilter, b] : brandFilter.filter((x) => x !== b))} /> {b}<span className="ml-auto text-xs text-muted-foreground">{matches.filter((t) => t.brand === b).length}</span></label>)}</div>
          </aside>
          {shown.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((t) => {
                const off = Math.round((1 - t.price / t.list) * 100);
                const detail = toTireDetail(t);
                return <article key={t.brand + t.model} role="button" tabIndex={0} onClick={() => setSelectedProduct(detail)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setSelectedProduct(detail); } }} className="flex cursor-pointer flex-col border border-border bg-background p-4 text-center transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <div className="relative"><span className="absolute left-0 top-0 rounded-sm bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">-{off}%</span>
                    <p className="text-xs font-black italic text-primary">{t.brand}</p>
                    <img src={tireImg} alt={`Llanta ${t.brand} ${t.model} ${t.size}`} width={816} height={816} loading="lazy" className="mx-auto mt-2 aspect-square w-44 object-contain" /></div>
                  <h3 className="mt-3 font-black uppercase">{t.brand} {t.model}</h3>
                  <p className="text-sm font-bold">{t.size} {t.load}</p>
                  <p className="mt-2 text-sm text-muted-foreground line-through">{money(t.list)}</p>
                  <p className="text-xl font-black text-primary">{money(t.price)}</p>
                  <p className="text-[11px] text-muted-foreground">Precio con IVA incluido</p>
                  <p className={`mt-1 text-xs font-semibold ${t.stock ? "text-foreground" : "text-muted-foreground"}`}>{t.stock ? "En existencia" : "Sobre pedido"}</p>
                  <Button variant="outline" className="mt-4" onClick={(event) => { event.stopPropagation(); setSelectedProduct(detail); }}><Eye /> Vista rápida</Button>
                  <Button variant="dark" className="mt-4" onClick={(event) => { event.stopPropagation(); onAddToCart({
                    id: `tire-${t.brand}-${t.model}-${t.size}`,
                    name: `${t.brand} ${t.model}`,
                    category: "Llanta",
                    detail: `${t.size} · Índice ${t.load} · ${t.stock ? "En existencia" : "Sobre pedido"}`,
                    price: t.price,
                    image: tireImg,
                  }); }}><ShoppingCart /> {t.stock ? "Añadir al carrito" : "Cotizar"}</Button>
                </article>;
              })}
            </div>
          ) : <p className="rounded-md bg-brand-soft p-6 text-sm">No hay llantas con esos filtros. Escríbenos por WhatsApp y la conseguimos.</p>}
        </div>
        <ProductDetailDialog product={selectedProduct} relatedProducts={relatedProducts} onSelectProduct={setSelectedProduct} onAddToCart={onAddToCart} />
      </section>
  ) : null;

  if (embedded) return <>{card}{results}</>;

  return <>
    <div id="buscador" className={`relative z-10 mx-auto max-w-6xl scroll-mt-28 px-4 ${variant === "hero" ? "-mt-24 sm:-mt-28" : "-mt-20"}`}>
      {card}
    </div>
    {results}
  </>;
}
