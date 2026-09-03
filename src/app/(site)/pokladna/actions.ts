"use server";

import { createClient } from "@/lib/supabase/server";
import { sendOrderEmails } from "@/lib/email";
import type { CartItem, PaymentMethod } from "@/types";

export type CreateOrderInput = {
  customerName: string;
  email: string;
  phone: string;
  addressStreet: string;
  addressCity: string;
  addressZip: string;
  paymentMethod: PaymentMethod;
  note: string;
  items: CartItem[];
};

type CreateOrderResult = {
  error?: string;
  orderId?: string;
  orderNumber?: number;
};

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  try {
    if (!input.customerName.trim()) return { error: "Jméno je povinné" };
    if (!input.email.trim()) return { error: "E-mail je povinný" };
    if (!input.addressStreet.trim()) return { error: "Ulice a č.p. jsou povinné" };
    if (!input.addressCity.trim()) return { error: "Město je povinné" };
    if (!input.addressZip.trim()) return { error: "PSČ je povinné" };
    if (input.items.length === 0) return { error: "Košík je prázdný" };

    const totalPrice = input.items.reduce(
      (sum, item) => sum + item.unitPriceCzk * item.quantity,
      0,
    );

    const supabase = await createClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: input.customerName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim() || null,
        address_street: input.addressStreet.trim(),
        address_city: input.addressCity.trim(),
        address_zip: input.addressZip.trim(),
        payment_method: input.paymentMethod,
        note: input.note.trim() || null,
        total_price: totalPrice,
      })
      .select("id, order_number")
      .single();

    if (orderError || !order) {
      return {
        error: orderError?.message ?? "Objednávku se nepodařilo uložit",
      };
    }

    const itemsPayload = input.items.map((item) => ({
      order_id: order.id as string,
      product_name: item.name,
      config_summary:
        item.configSummary.length > 0 ? item.configSummary.join(", ") : null,
      unit_price: item.unitPriceCzk,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) return { error: itemsError.message };

    // Best-effort — a missing/failed email must never fail the order itself.
    try {
      await sendOrderEmails({
        orderId: order.id as string,
        orderNumber: order.order_number as number,
        customerName: input.customerName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim() || null,
        addressStreet: input.addressStreet.trim(),
        addressCity: input.addressCity.trim(),
        addressZip: input.addressZip.trim(),
        paymentMethod: input.paymentMethod,
        note: input.note.trim() || null,
        items: input.items.map((item) => ({
          name: item.name,
          configSummary:
            item.configSummary.length > 0 ? item.configSummary.join(", ") : null,
          quantity: item.quantity,
          unitPriceCzk: item.unitPriceCzk,
        })),
        totalCzk: totalPrice,
      });
    } catch {
      // Order is already saved — swallow email errors.
    }

    return {
      orderId: order.id as string,
      orderNumber: order.order_number as number,
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}
