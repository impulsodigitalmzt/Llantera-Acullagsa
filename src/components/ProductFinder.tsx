import { useMemo, useState } from "react";
import { BatteryCharging, CircleDot, Eye, Search, ShoppingCart, SlidersHorizontal, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductDetailProduct } from "@/components/ProductDetailDialog";
import { ProductQuickView } from "@/components/ProductQuickView";
import { BATTERY_CATALOG, VEHICLES, YEARS, money, shocksForVehicle } from "@/data/catalog";
import type { CartItem } from "@/components/ShoppingCart";

type Category = "acumuladores" | "amortiguadores";
type ResultProduct = ProductDetailProduct & { list: number; detail: string; stock: boolean };

const BATTERY_IMAGES: Record<string, string> = {
  Automotriz: "LTH-Automotriz-2019-300x192.jpg",
  "HI-TEC": "LTH-HITEC-2019-300x192.jpg",
  AGM: "Foto-LTH-AGM-Auto-2016-1-300x192.jpg",
  "Heavy Duty": "LTH-HEAVY-DUTY-2019-300x192.jpg",
};

const CONFIG: Record<Category, {
  title: string;
  subtitle: string;
  button: string;
  icon: typeof BatteryCharging;
}> = {
  acumuladores: {
    title: "Encuentra el acumulador para tu vehículo",
    subtitle: "Dinos qué auto tienes y te mostramos las baterías LTH compatibles, con precio y garantía.",
    button: "Ver acumuladores",
    icon: BatteryCharging,
  },
  amortiguadores: {
    title: "Encuentra los amortiguadores para tu vehículo",
    subtitle: "Selecciona marca, modelo y año; te mostramos las opciones delanteras y traseras compatibles.",
    button: "Ver amortiguadores",
    icon: CircleDot,
  },
};

export function ProductFinder({ category, onAddToCart, onOpenProduct }: {
  category: Category;
  onAddToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  onOpenProduct: (product: ProductDetailProduct, products: ProductDetailProduct[]) => void;
}) {
  const cfg = CONFIG[category];
  const Icon = cfg.icon;
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<{ make: string; model: string; year: string } | null>(null);
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [onlyStock, setOnlyStock] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("relevance");
  const [quickViewProduct, setQuickViewProduct] = useState<ProductDetailProduct | null>(null);

  const canSearch = make && model && year;
  const resultId = `resultados-${category}`;

  const search = () => {
    if (!canSearch) return;
    setBrandFilter([]); setOnlyStock(false); setMinPrice(""); setMaxPrice(""); setSort("relevance");
    setResult({ make, model, year });
    setTimeout(() => document.getElementById(resultId)?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const batteryGroup = result ? VEHICLES[result.make]?.[result.model]?.battery ?? "" : "";
  const batteries = useMemo(
    () => (category === "acumuladores" && result ? BATTERY_CATALOG.filter((b) => b.group === batteryGroup) : []),
    [category, result, batteryGroup],
  );
  const shocks = useMemo(
    () => (category === "amortiguadores" && result ? shocksForVehicle(result.make, result.model) : []),
    [category, result],
  );
  const products = useMemo<ResultProduct[]>(() => category === "acumuladores"
    ? batteries.map((battery) => ({
      id: `battery-${battery.group}-${battery.line}`,
      brand: battery.brand,
      name: `${battery.brand} ${battery.line}`,
      category: "Acumulador",
      sku: `LTH-${battery.group.replaceAll("/", "-")}-${battery.line.toUpperCase().replaceAll(" ", "-")}`,
      detail: `Grupo ${battery.group} · ${battery.cca} CCA · Garantía ${battery.warranty}`,
      price: battery.price,
      list: battery.list,
      stock: battery.stock,
      stockCount: battery.stock ? 5 + battery.cca % 16 : 0,
      image: `/acumuladores/${BATTERY_IMAGES[battery.line]}`,
      gallery: [`/acumuladores/${BATTERY_IMAGES[battery.line]}`],
      description: [
        `El acumulador LTH ${battery.line} está listado para vehículos que utilizan el grupo ${battery.group}. En esta búsqueda aparece como compatible con ${result?.make} ${result?.model} ${result?.year}; confirma que la versión y motorización de tu vehículo correspondan antes de realizar el pedido.`,
        `Su capacidad de arranque en frío indicada es de ${battery.cca} CCA. Este valor describe la capacidad de entregar corriente durante el arranque en condiciones frías; no corresponde a la capacidad en amperios-hora (Ah), dato que no está especificado en este catálogo. La garantía publicada para esta línea es de ${battery.warranty}, sujeta a las condiciones del fabricante.`,
        `Antes de instalarlo, compara el grupo, las dimensiones de la charola, la orientación de los bornes y el sistema de sujeción con el acumulador que usa el vehículo. La posición y polaridad de terminales deben verificarse físicamente; consulta con un técnico si el vehículo requiere registro electrónico o un procedimiento de instalación especial.`,
      ].join("\n\n"),
      specifications: [
        { label: "Línea", value: battery.line },
        { label: "Grupo", value: battery.group },
        { label: "Amperaje de arranque (CCA)", value: `${battery.cca} A` },
        { label: "Garantía", value: battery.warranty },
        { label: "Vehículo consultado", value: `${result?.make} ${result?.model} ${result?.year}` },
        { label: "Polaridad y posición de bornes", value: "Confirmar físicamente" },
        { label: "Dimensiones", value: "Consultar ficha del fabricante" },
      ],
      cartItem: {
        id: `battery-${battery.group}-${battery.line}`,
        name: `${battery.brand} ${battery.line}`,
        category: "Acumulador",
        detail: `Grupo ${battery.group} · ${battery.cca} CCA · ${result?.make} ${result?.model} ${result?.year} · ${battery.stock ? "En existencia" : "Sobre pedido"}`,
        price: battery.price,
        image: `/acumuladores/${BATTERY_IMAGES[battery.line]}`,
      },
    }))
    : shocks.map((shock) => ({
      id: `shock-${result?.make}-${result?.model}-${shock.brand}-${shock.position}`,
      brand: shock.brand,
      name: `${shock.brand} ${shock.model}`,
      category: "Amortiguador",
      sku: `${shock.brand}-${result?.make}-${result?.model}-${shock.position}`.replaceAll(" ", "-").toUpperCase(),
      detail: `${shock.position} · pieza`,
      price: shock.price,
      list: shock.list,
      stock: shock.stock,
      stockCount: shock.stock ? 3 + (shock.price % 14) : 0,
      gallery: [],
      description: [
        `Amortiguador ${shock.brand} ${shock.model} para la posición ${shock.position.toLowerCase()}, correspondiente al vehículo ${result?.make} ${result?.model} ${result?.year} seleccionado en la búsqueda. El amortiguador controla el movimiento de la suspensión y ayuda a mantener el contacto de la rueda con el camino durante la marcha.`,
        `La aplicación se identifica por marca, modelo, año y posición. La publicación corresponde a una pieza; no incluye el par ni otros componentes de suspensión. El lado específico, las dimensiones, el tipo de anclaje y la calibración no vienen desglosados en los datos disponibles, por lo que deben verificarse con el número de parte y la ficha del fabricante.`,
        `Antes de comprar, compara la aplicación con la versión exacta del vehículo y confirma si necesitas la pieza del lado izquierdo o derecho. Durante el reemplazo, revisa también los soportes y componentes relacionados de la suspensión para detectar desgaste o daños.`,
      ].join("\n\n"),
      specifications: [
        { label: "Marca", value: shock.brand },
        { label: "Línea", value: shock.model },
        { label: "Posición", value: shock.position },
        { label: "Vehículo", value: `${result?.make} ${result?.model} ${result?.year}` },
        { label: "Cantidad", value: "1 pieza" },
        { label: "Lado de montaje", value: "Confirmar con número de parte" },
        { label: "Dimensiones y anclaje", value: "Consultar ficha del fabricante" },
        { label: "Tipo", value: "Amortiguador de suspensión" },
      ],
      cartItem: {
        id: `shock-${result?.make}-${result?.model}-${shock.brand}-${shock.position}`,
        name: `${shock.brand} ${shock.model}`,
        category: "Amortiguador",
        detail: `${shock.position} · ${result?.make} ${result?.model} ${result?.year} · ${shock.stock ? "En existencia" : "Sobre pedido"}`,
        price: shock.price,
      },
    })), [category, batteries, shocks, result]);
  const shownProducts = useMemo(() => products
    .filter((product) => !brandFilter.length || brandFilter.includes(product.brand))
    .filter((product) => !onlyStock || product.stock)
    .filter((product) => !minPrice || product.price >= Number(minPrice))
    .filter((product) => !maxPrice || product.price <= Number(maxPrice))
    .sort((a, b) => sort === "asc" ? a.price - b.price : sort === "desc" ? b.price - a.price : Number(b.stock) - Number(a.stock)),
  [products, brandFilter, onlyStock, minPrice, maxPrice, sort]);
  const brands = [...new Set(products.map((product) => product.brand))];

  const sel = "h-12 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";
  const field = "flex min-w-0 flex-col gap-2 text-xs font-bold";
  const formGrid = "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]";

  return <>
    <div className="overflow-hidden rounded-md bg-background shadow-xl ring-1 ring-border">
      <div className="p-5 md:p-7">
        <h3 className="flex items-center gap-2 text-xl font-black sm:text-2xl"><Icon className="size-6 text-primary" /> {cfg.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{cfg.subtitle}</p>
        <div className={formGrid}>
          <label className={field}>Marca<select className={sel} value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }}><option value="">Marca</option>{Object.keys(VEHICLES).map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className={field}>Modelo<select className={sel} disabled={!make} value={model} onChange={(e) => setModel(e.target.value)}><option value="">Modelo</option>{make && Object.keys(VEHICLES[make] ?? {}).map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className={field}>Año<select className={sel} disabled={!model} value={year} onChange={(e) => setYear(e.target.value)}><option value="">Año</option>{YEARS.map((x) => <option key={x}>{x}</option>)}</select></label>
          <Button size="xl" variant="hero" disabled={!canSearch} className="h-12 w-full self-end justify-center whitespace-nowrap" onClick={search}><Search /> {cfg.button}</Button>
        </div>
      </div>
    </div>

    {result && (
      <section id={resultId} className="scroll-mt-28 pt-10">
        <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-primary">{result.make} {result.model} {result.year}{category === "acumuladores" ? ` · Grupo ${batteryGroup}` : ""}</p>
            <h4 className="mt-1 text-2xl font-black">{category === "acumuladores" ? "Acumuladores compatibles" : "Amortiguadores compatibles"}</h4>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{shownProducts.length} de {products.length} productos</span>
            <label className="flex items-center gap-2 font-semibold">Ordenar por<select aria-label="Ordenar productos" value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3"><option value="relevance">Relevancia</option><option value="asc">Precio, menor a mayor</option><option value="desc">Precio, mayor a menor</option></select></label>
          </div>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="space-y-6 border-b border-border pb-5 text-sm lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"><SlidersHorizontal className="size-4" /> Filtros</p>
            <div><p className="border-b border-border pb-2 text-xs font-black uppercase tracking-widest">Disponibilidad</p><label className="mt-3 flex items-center gap-2"><input type="checkbox" checked={onlyStock} onChange={(event) => setOnlyStock(event.target.checked)} className="accent-primary" /> En existencia<span className="ml-auto text-xs text-muted-foreground">{products.filter((product) => product.stock).length}</span></label></div>
            <div><p className="border-b border-border pb-2 text-xs font-black uppercase tracking-widest">Precio</p><div className="mt-3 grid grid-cols-2 gap-2"><label className="text-xs text-muted-foreground">Mínimo<input type="number" min="0" inputMode="numeric" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="$0" className="mt-1 h-10 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground" /></label><label className="text-xs text-muted-foreground">Máximo<input type="number" min="0" inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Sin límite" className="mt-1 h-10 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground" /></label></div></div>
            <div><p className="border-b border-border pb-2 text-xs font-black uppercase tracking-widest">Marca</p>{brands.map((brand) => <label key={brand} className="mt-3 flex items-center gap-2"><input type="checkbox" checked={brandFilter.includes(brand)} onChange={(event) => setBrandFilter(event.target.checked ? [...brandFilter, brand] : brandFilter.filter((selected) => selected !== brand))} className="accent-primary" /> {brand}<span className="ml-auto text-xs text-muted-foreground">{products.filter((product) => product.brand === brand).length}</span></label>)}</div>
          </aside>
          {shownProducts.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shownProducts.map((product) => {
              const discount = Math.round((1 - product.price / product.list) * 100);
              const detailProduct: ProductDetailProduct = product;
              return <article key={product.id} role="button" tabIndex={0} onClick={() => onOpenProduct(detailProduct, products)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onOpenProduct(detailProduct, products); } }} className="group/card flex cursor-pointer flex-col border border-border bg-background p-4 text-center transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div className="relative flex aspect-square items-center justify-center"><span className="absolute left-0 top-0 z-10 bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">-{discount}%</span>{product.gallery[0] ? <img src={product.gallery[0]} alt={product.name} loading="lazy" className="size-full object-contain" /> : <Wrench className="size-20 text-primary" />}<Button variant="hero" size="sm" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover/card:pointer-events-auto group-hover/card:opacity-100 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100" onClick={(event) => { event.stopPropagation(); setQuickViewProduct(detailProduct); }}><Eye /> Vista rápida</Button></div>
                <p className="mt-2 text-xs font-black italic text-primary">{product.brand}</p>
                <h5 className="mt-1 font-black uppercase">{product.name}</h5>
                <p className="text-sm font-bold">{product.detail}</p>
                <p className="mt-2 text-sm text-muted-foreground line-through">{money(product.list)}</p>
                <p className="text-xl font-black text-primary">{money(product.price)}</p>
                <p className="text-[11px] text-muted-foreground">Precio con IVA incluido</p>
                <p className={`mt-1 text-xs font-semibold ${product.stock ? "text-foreground" : "text-muted-foreground"}`}>{product.stock ? "En existencia" : "Sobre pedido"}</p>
                <Button variant="dark" className="mt-4" onClick={(event) => { event.stopPropagation(); onAddToCart(product.cartItem); }}><ShoppingCart /> {product.stock ? "Añadir al carrito" : "Cotizar"}</Button>
              </article>;
            })}
          </div> : <p className="rounded-md bg-brand-soft p-6 text-sm">No hay productos con esos filtros. Ajusta la búsqueda o solicita una cotización.</p>}
        </div>
      </section>
    )}
    <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={onAddToCart} />
  </>;
}
