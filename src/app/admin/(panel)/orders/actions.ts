"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types";

type ActionResult = { error?: string };

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Nepřihlášený uživatel");

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/orders");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}
