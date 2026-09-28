"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/types";
import type { OrderStatus } from "@/types";
import { formatPrice } from "@/lib/format";
import {
  deleteAllOrders,
  deleteOrder,
  updateOrderStatus,
} from "@/app/admin/(panel)/orders/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderWithItems } from "@/app/admin/(panel)/orders/page";

const STATUS_BADGE_VARIANT: Record<OrderStatus, "default" | "secondary"> = {
  new: "default",
  processing: "default",
  shipped: "default",
  done: "secondary",
  cancelled: "secondary",
};

export function OrdersList({ orders }: { orders: OrderWithItems[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onStatusChange(id: string, status: OrderStatus) {
    startTransition(async () => {
      const res = await updateOrderStatus(id, status);
      if (res.error) {
        toast.error("Změna se nepovedla", { description: res.error });
        return;
      }
      toast.success("Stav objednávky upraven");
      router.refresh();
    });
  }

  function onDelete(order: OrderWithItems) {
    if (
      !window.confirm(
        `Trvale smazat objednávku #${order.order_number} (${order.customer_name})? Tohle se nedá vzít zpět.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      const res = await deleteOrder(order.id);
      if (res.error) {
        toast.error("Smazání selhalo", { description: res.error });
        return;
      }
      toast.success("Objednávka smazána");
      router.refresh();
    });
  }

  function onDeleteAll() {
    if (
      !window.confirm(
        `Trvale smazat všech ${orders.length} objednávek a vynulovat tržby? Tohle se nedá vzít zpět.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      const res = await deleteAllOrders();
      if (res.error) {
        toast.error("Smazání selhalo", { description: res.error });
        return;
      }
      toast.success("Všechny objednávky smazány, tržby vynulované");
      router.refresh();
    });
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-10 text-center text-sm">
          Zatím žádné objednávky.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          disabled={pending}
          onClick={onDeleteAll}
        >
          <Trash2 className="size-4" />
          Smazat všechny objednávky (reset tržeb)
        </Button>
      </div>

      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="space-y-4 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">
                    #{order.order_number} — {order.customer_name}
                  </p>
                  <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {order.email}
                  {order.phone ? ` · ${order.phone}` : ""}
                </p>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {order.address_street}, {order.address_zip} {order.address_city}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {PAYMENT_METHOD_LABELS[order.payment_method]} ·{" "}
                  {new Date(order.created_at).toLocaleString("cs-CZ")}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="font-heading text-ice text-lg font-bold">
                  {formatPrice(order.total_price)}
                </p>
                <Select
                  value={order.status}
                  onValueChange={(v) => onStatusChange(order.id, v as OrderStatus)}
                  disabled={pending}
                >
                  <SelectTrigger className="h-8 w-40 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {ORDER_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive h-8"
                  disabled={pending}
                  onClick={() => onDelete(order)}
                >
                  <Trash2 className="size-3.5" />
                  Smazat
                </Button>
              </div>
            </div>

            {order.note && (
              <p className="border-border/60 text-muted-foreground rounded-md border border-dashed px-3 py-2 text-sm">
                Poznámka: {order.note}
              </p>
            )}

            <div className="border-border/60 divide-border/60 divide-y rounded-md border">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate">
                      {item.product_name} × {item.quantity}
                    </p>
                    {item.config_summary && (
                      <p className="text-muted-foreground truncate text-xs">
                        {item.config_summary}
                      </p>
                    )}
                  </div>
                  <span className="text-muted-foreground shrink-0">
                    {formatPrice(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
