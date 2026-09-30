// Catálogo demostrativo para la propuesta de e-commerce de Acullagsa.
// Precios, modelos y equivalencias son de ejemplo.

export function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export const money = (n: number) => `$ ${n.toLocaleString("es-MX")}.00`;

// ============ Vehículos ============
export type VehicleSpec = { tire: string; battery: string; shocks: boolean };

export const VEHICLES: Record<string, Record<string, VehicleSpec>> = {
  CHEVROLET: {
    Aveo: { tire: "185/55R15", battery: "35", shocks: true },
    Spark: { tire: "155/80R13", battery: "22F", shocks: true },
    Onix: { tire: "185/65R15", battery: "48/H6", shocks: true },
    Silverado: { tire: "265/70R17", battery: "65", shocks: true },
    Tracker: { tire: "215/55R17", battery: "48/H6", shocks: true },
  },
  NISSAN: {
    Versa: { tire: "185/65R15", battery: "35", shocks: true },
    March: { tire: "175/65R14", battery: "22F", shocks: true },
    Sentra: { tire: "205/55R16", battery: "35", shocks: true },
    NP300: { tire: "215/60R16", battery: "24F", shocks: true },
    Kicks: { tire: "205/55R16", battery: "35", shocks: true },
  },
  VOLKSWAGEN: {
    Vento: { tire: "185/60R14", battery: "48/H6", shocks: true },
    Jetta: { tire: "205/55R16", battery: "48/H6", shocks: true },
    Tiguan: { tire: "235/60R18", battery: "48/H6", shocks: true },
  },
  TOYOTA: {
    Yaris: { tire: "185/60R14", battery: "35", shocks: true },
    Corolla: { tire: "205/55R16", battery: "35", shocks: true },
    Hilux: { tire: "265/65R17", battery: "27F", shocks: true },
    RAV4: { tire: "225/65R17", battery: "24F", shocks: true },
  },
  FORD: {
    Figo: { tire: "175/65R14", battery: "22F", shocks: true },
    Ranger: { tire: "265/65R17", battery: "65", shocks: true },
    "F-150": { tire: "265/70R17", battery: "65", shocks: true },
  },
  HONDA: {
    City: { tire: "185/55R15", battery: "35", shocks: true },
    Civic: { tire: "215/55R17", battery: "48/H6", shocks: true },
    "CR-V": { tire: "235/65R17", battery: "24F", shocks: true },
  },
};

export const YEARS = Array.from({ length: 12 }, (_, i) => String(2026 - i));

// ============ Acumuladores ============
export type Battery = {
  brand: string; line: string; group: string; cca: number;
  warranty: string; price: number; list: number; stock: boolean;
};

export const BATTERY_GROUPS = ["22F", "24F", "35", "48/H6", "65", "27F"];

const BATTERY_LINES = [
  { brand: "LTH", line: "Automotriz", base: 0, warranty: "18 meses" },
  { brand: "LTH", line: "HI-TEC", base: 600, warranty: "24 meses" },
  { brand: "LTH", line: "AGM", base: 1800, warranty: "36 meses" },
  { brand: "LTH", line: "Heavy Duty", base: 1100, warranty: "24 meses" },
];

export const BATTERY_CATALOG: Battery[] = BATTERY_GROUPS.flatMap((group) => {
  const gi = BATTERY_GROUPS.indexOf(group);
  return BATTERY_LINES.filter((l) => hash(group + l.line) % 4 !== 0).map((l) => {
    const h = hash(l.line + group);
    const price = Math.round((2100 + gi * 250 + l.base + (h % 700)) / 10) * 10 - 1;
    return {
      brand: l.brand, line: l.line, group,
      cca: 400 + gi * 60 + (h % 200),
      warranty: l.warranty,
      price, list: Math.round(price * 1.25), stock: h % 5 !== 0,
    };
  });
});

// ============ Amortiguadores ============
export type Shock = {
  brand: string; model: string; position: string;
  price: number; list: number; stock: boolean;
};

const SHOCK_BRANDS = [
  { brand: "KYB", model: "Excel-G", base: 400 },
  { brand: "MONROE", model: "OESpectrum", base: 550 },
  { brand: "GABRIEL", model: "Ultra", base: 250 },
];

export function shocksForVehicle(make: string, model: string): Shock[] {
  const key = `${make} ${model}`;
  const h = hash(key);
  return SHOCK_BRANDS.flatMap((b, bi) =>
    ["Delantero", "Trasero"].map((position, pi) => {
      const hh = hash(key + b.brand + position);
      const price = Math.round((950 + b.base + pi * 150 + (hh % 600)) / 10) * 10 - 1;
      return {
        brand: b.brand, model: b.model, position,
        price, list: Math.round(price * 1.3), stock: (hh + h + bi) % 6 !== 0,
      };
    }),
  );
}
