import { useMemo, useState } from "react";
import { BatteryCharging, CarFront, CircleDot, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BATTERY_CATALOG, VEHICLES, YEARS, money, shocksForVehicle } from "@/data/catalog";

type Category = "acumuladores" | "amortiguadores";

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

export function ProductFinder({ category }: { category: Category }) {
  const cfg = CONFIG[category];
  const Icon = cfg.icon;
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<{ make: string; model: string; year: string } | null>(null);

  const canSearch = make && model && year;
  const resultId = `resultados-${category}`;

  const search = () => {
    if (!canSearch) return;
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

  const sel = "mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";

  return <>
    <div className="overflow-hidden rounded-md bg-background shadow-xl ring-1 ring-border">
      <div className="p-5 md:p-7">
        <h3 className="flex items-center gap-2 text-xl font-black sm:text-2xl"><Icon className="size-6 text-primary" /> {cfg.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{cfg.subtitle}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="text-xs font-bold">Marca<select className={sel} value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }}><option value="">Marca</option>{Object.keys(VEHICLES).map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="text-xs font-bold">Modelo<select className={sel} disabled={!make} value={model} onChange={(e) => setModel(e.target.value)}><option value="">Modelo</option>{make && Object.keys(VEHICLES[make] ?? {}).map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="text-xs font-bold">Año<select className={sel} disabled={!model} value={year} onChange={(e) => setYear(e.target.value)}><option value="">Año</option>{YEARS.map((x) => <option key={x}>{x}</option>)}</select></label>
          <Button size="xl" variant="hero" disabled={!canSearch} className="self-end" onClick={search}><Search /> {cfg.button}</Button>
        </div>
      </div>
    </div>

    {result && category === "acumuladores" && (
      <div id={resultId} className="scroll-mt-28 pt-10">
        <p className="text-xs font-bold uppercase text-primary">{result.make} {result.model} {result.year} · Grupo {batteryGroup}</p>
        <h4 className="mt-1 text-2xl font-black">Acumuladores compatibles ({batteries.length})</h4>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {batteries.map((b) => {
            const off = Math.round((1 - b.price / b.list) * 100);
            const msg = encodeURIComponent(`Hola, me interesa el acumulador ${b.brand} ${b.line} grupo ${b.group} para mi ${result.make} ${result.model} ${result.year} (${money(b.price)}).`);
            return <article key={b.line} className="flex flex-col rounded-md border border-border bg-background p-5 transition-shadow hover:shadow-lg">
              <div className="flex items-start justify-between">
                <p className="text-xs font-black italic text-primary">{b.brand}</p>
                <span className="rounded-sm bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">-{off}%</span>
              </div>
              <h5 className="mt-2 text-lg font-black uppercase">{b.brand} {b.line}</h5>
              <p className="text-sm font-bold">Grupo {b.group} · {b.cca} CCA</p>
              <p className="mt-1 text-xs text-muted-foreground">Garantía {b.warranty}</p>
              <p className="mt-3 text-sm text-muted-foreground line-through">{money(b.list)}</p>
              <p className="text-xl font-black text-primary">{money(b.price)}</p>
              <p className={`mt-1 text-xs font-semibold ${b.stock ? "text-foreground" : "text-muted-foreground"}`}>{b.stock ? "En existencia" : "Sobre pedido"}</p>
              <Button asChild variant="dark" className="mt-4"><a href={`https://wa.me/526699402253?text=${msg}`} target="_blank" rel="noreferrer"><MessageCircle /> Cotizar</a></Button>
            </article>;
          })}
        </div>
      </div>
    )}

    {result && category === "amortiguadores" && (
      <div id={resultId} className="scroll-mt-28 pt-10">
        <p className="text-xs font-bold uppercase text-primary">{result.make} {result.model} {result.year}</p>
        <h4 className="mt-1 text-2xl font-black">Amortiguadores compatibles ({shocks.length})</h4>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shocks.map((s) => {
            const off = Math.round((1 - s.price / s.list) * 100);
            const msg = encodeURIComponent(`Hola, me interesa el amortiguador ${s.brand} ${s.model} ${s.position.toLowerCase()} para mi ${result.make} ${result.model} ${result.year} (${money(s.price)}).`);
            return <article key={s.brand + s.position} className="flex flex-col rounded-md border border-border bg-background p-5 transition-shadow hover:shadow-lg">
              <div className="flex items-start justify-between">
                <p className="text-xs font-black italic text-primary">{s.brand}</p>
                <span className="rounded-sm bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">-{off}%</span>
              </div>
              <h5 className="mt-2 text-lg font-black uppercase">{s.brand} {s.model}</h5>
              <p className="text-sm font-bold">{s.position} · pieza</p>
              <p className="mt-3 text-sm text-muted-foreground line-through">{money(s.list)}</p>
              <p className="text-xl font-black text-primary">{money(s.price)}</p>
              <p className={`mt-1 text-xs font-semibold ${s.stock ? "text-foreground" : "text-muted-foreground"}`}>{s.stock ? "En existencia" : "Sobre pedido"}</p>
              <Button asChild variant="dark" className="mt-4"><a href={`https://wa.me/526699402253?text=${msg}`} target="_blank" rel="noreferrer"><MessageCircle /> Cotizar</a></Button>
            </article>;
          })}
        </div>
      </div>
    )}
  </>;
}
