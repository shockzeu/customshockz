"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types";

type ActionResult = { error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nepřihlášený uživatel");
  return supabase;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}

/** Permanently deletes one order (its order_items cascade with it). */
export async function deleteOrder(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();

    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}

/** Permanently deletes every order — for wiping test orders / resetting "Tržby celkem". */
export async function deleteAllOrders(): Promise<ActionResult> {
  try {
    const supabase = await requireUser();

    // Supabase requires a filter on delete — this matches every row since
    // order_number is always set (auto-increment, never null).
    const { error } = await supabase
      .from("orders")
      .delete()
      .not("order_number", "is", null);
    if (error) return { error: error.message };

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}
