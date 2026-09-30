import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Check,
  Minus,
  Package,
  Plus,
  ShoppingCart as ShoppingCartIcon,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export type CartItem = {
  id: string;
  name: string;
  category: string;
  detail: string;
  price: number;
  image?: string;
  quantity: number;
};

type ShoppingCartProps = {
  items: CartItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

const formatPrice = (amount: number) => `$${amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

export function ShoppingCart({
  items,
  open,
  onOpenChange,
  onUpdateQuantity,
  onRemove,
  onClear,
}: ShoppingCartProps) {
  const [stage, setStage] = useState<"cart" | "checkout" | "complete">("cart");
  const [delivery, setDelivery] = useState<"pickup" | "delivery">("pickup");
  const [order, setOrder] = useState<{ number: string; total: number; itemCount: number } | null>(null);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = delivery === "delivery" && items.length > 0 ? 150 : 0;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (open) {
      setStage("cart");
      setOrder(null);
    }
  }, [open]);

  const completeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrder({ number: `AG-${Date.now().toString().slice(-6)}`, total, itemCount });
    onClear();
    setStage("complete");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-6 py-5 pr-14 text-left">
          <SheetTitle className="flex items-center gap-2 text-xl font-black">
            {stage === "checkout" && (
              <button type="button" aria-label="Volver al carrito" onClick={() => setStage("cart")} className="mr-1 rounded-sm p-1 hover:bg-muted">
                <ArrowLeft className="size-5" />
              </button>
            )}
            {stage === "complete" ? "Pedido de demostración" : stage === "checkout" ? "Finalizar pedido" : "Tu carrito"}
          </SheetTitle>
          <SheetDescription>
            {stage === "complete" ? "Resumen de la solicitud generada en esta propuesta." : "Productos seleccionados para tu vehículo."}
          </SheetDescription>
        </SheetHeader>

        {stage === "complete" && order ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-green-100 text-green-700"><Check className="size-7" /></span>
            <h3 className="mt-5 text-2xl font-black">Solicitud registrada</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Tu pedido <strong className="text-foreground">{order.number}</strong> quedó preparado como demostración. No se procesó ningún pago.</p>
            <div className="mt-6 w-full border-y border-border py-4 text-sm">
              <div className="flex justify-between"><span>Artículos</span><span>{order.itemCount}</span></div>
              <div className="mt-2 flex justify-between font-black"><span>Total estimado</span><span>{formatPrice(order.total)}</span></div>
            </div>
            <Button className="mt-6 w-full" onClick={() => onOpenChange(false)}>Seguir comprando</Button>
          </div>
        ) : stage === "checkout" ? (
          <form onSubmit={completeOrder} className="flex flex-1 flex-col">
            <div className="flex-1 space-y-6 px-6 py-6">
              <fieldset className="space-y-3">
                <legend className="text-sm font-black">Datos de contacto</legend>
                <label className="block text-xs font-bold">Nombre completo<input required autoComplete="name" className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring" /></label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-bold">Correo electrónico<input required type="email" autoComplete="email" className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring" /></label>
                  <label className="block text-xs font-bold">Teléfono<input required type="tel" autoComplete="tel" className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring" /></label>
                </div>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="text-sm font-black">Entrega</legend>
                <label className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${delivery === "pickup" ? "border-primary bg-brand-soft" : "border-border"}`}>
                  <input type="radio" name="delivery" value="pickup" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} className="accent-primary" />
                  <Store className="size-4 text-primary" /><span className="flex-1">Recoger en sucursal</span><span className="text-xs font-bold">Sin costo</span>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${delivery === "delivery" ? "border-primary bg-brand-soft" : "border-border"}`}>
                  <input type="radio" name="delivery" value="delivery" checked={delivery === "delivery"} onChange={() => setDelivery("delivery")} className="accent-primary" />
                  <Truck className="size-4 text-primary" /><span className="flex-1">Entrega a domicilio</span><span className="text-xs font-bold">$150.00</span>
                </label>
                {delivery === "delivery" && <label className="block text-xs font-bold">Dirección de entrega<input required autoComplete="street-address" className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring" /></label>}
              </fieldset>

              <label className="block text-xs font-bold">Forma de pago preferida<select defaultValue="" required className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring"><option value="" disabled>Selecciona una opción</option><option>Efectivo al recibir o recoger</option><option>Terminal al recibir</option><option>Transferencia bancaria</option></select></label>
              <p className="text-xs leading-5 text-muted-foreground">Esta es una tienda de demostración. El envío, disponibilidad y pago se confirmarían al conectar el sistema real.</p>
            </div>
            <div className="sticky bottom-0 border-t border-border bg-background px-6 py-5">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="mt-2 flex justify-between text-sm"><span>Envío</span><span>{shipping ? formatPrice(shipping) : "Sin costo"}</span></div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-black"><span>Total estimado</span><span>{formatPrice(total)}</span></div>
              <Button type="submit" className="mt-4 h-12 w-full">Generar pedido de demostración</Button>
            </div>
          </form>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <ShoppingCartIcon className="size-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-black">Tu carrito está vacío</h3>
            <p className="mt-1 text-sm text-muted-foreground">Agrega llantas, acumuladores o amortiguadores para continuar.</p>
            <Button className="mt-5" onClick={() => onOpenChange(false)}>Explorar productos</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border px-6">
              {items.map((item) => (
                <article key={item.id} className="flex gap-4 py-5">
                  <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-brand-soft p-2">
                    {item.image ? <img src={item.image} alt="" className="size-full object-contain" /> : <Package className="size-8 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase text-primary">{item.category}</p>
                    <h3 className="mt-1 font-black leading-snug">{item.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex h-9 items-center rounded-md border border-border">
                        <button type="button" aria-label={`Quitar una unidad de ${item.name}`} onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="flex size-9 items-center justify-center hover:bg-muted"><Minus className="size-3.5" /></button>
                        <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button type="button" aria-label={`Agregar una unidad de ${item.name}`} onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="flex size-9 items-center justify-center hover:bg-muted"><Plus className="size-3.5" /></button>
                      </div>
                      <span className="font-black">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button type="button" aria-label={`Eliminar ${item.name}`} onClick={() => onRemove(item.id)} className="self-start rounded-sm p-2 text-muted-foreground hover:bg-muted hover:text-primary"><Trash2 className="size-4" /></button>
                </article>
              ))}
            </div>
            <div className="sticky bottom-0 border-t border-border bg-background px-6 py-5">
              <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal ({itemCount} artículos)</span><span>{formatPrice(subtotal)}</span></div>
              <div className="mt-2 flex justify-between text-lg font-black"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
              <Button className="mt-4 h-12 w-full" onClick={() => setStage("checkout")}>Continuar con la compra</Button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">Pedido de demostración; no se procesan pagos en línea.</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}