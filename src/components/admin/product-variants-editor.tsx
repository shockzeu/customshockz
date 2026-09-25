"use client";

import { Plus, X } from "lucide-react";

import type { ProductOptionRow } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/admin/color-picker";

export type VariantDraft = {
  key: string;
  groupName: string;
  label: string;
  hexColor: string;
  priceCzk: string; // this variant's own total price, as typed
  imageUrl: string | null;
};

export function optionRowsToDrafts(
  rows: ProductOptionRow[],
  basePriceCzk: number,
): VariantDraft[] {
  return rows.map((r) => ({
    key: r.id,
    groupName: r.group_name,
    label: r.label,
    hexColor: r.hex_color ?? "",
    priceCzk: String(basePriceCzk + r.price_modifier / 100),
    imageUrl: r.image_url,
  }));
}

/**
 * Flat, editable table of a product's options (color/length/...), grouped
 * only visually by repeating the group name — simpler to build correctly
 * than nested per-group clusters, and every product here has at most two
 * groups anyway. Photos stay whatever they were at import; there's no
 * upload control here, just create/edit/remove rows and their price.
 *
 * Each row's price is its own total (what the customer actually pays for
 * that option), not a "+X Kč" surcharge — Lukáš found the surcharge framing
 * made a small size difference look like a huge markup. The product dialog
 * converts to/from the stored price_modifier at the base price.
 */
export function ProductVariantsEditor({
  value,
  onChange,
  basePriceCzk,
}: {
  value: VariantDraft[];
  onChange: (next: VariantDraft[]) => void;
  basePriceCzk: number;
}) {
  function update(key: string, patch: Partial<VariantDraft>) {
    onChange(value.map((v) => (v.key === key ? { ...v, ...patch } : v)));
  }

  function remove(key: string) {
    onChange(value.filter((v) => v.key !== key));
  }

  function add() {
    const lastGroup = value.at(-1)?.groupName ?? "";
    onChange([
      ...value,
      {
        key: crypto.randomUUID(),
        groupName: lastGroup,
        label: "",
        hexColor: "",
        priceCzk: String(basePriceCzk),
        imageUrl: null,
      },
    ]);
  }

  return (
    <div className="grid gap-2">
      {value.length > 0 && (
        <div className="overflow-x-auto">
          <div className="grid min-w-[600px] gap-2">
            <div className="text-muted-foreground grid grid-cols-[1fr_1fr_9.5rem_6rem_auto] gap-2 px-1 text-xs font-medium tracking-wide uppercase">
              <span>Skupina</span>
              <span>Popisek</span>
              <span>Barva</span>
              <span>Cena (Kč)</span>
              <span />
            </div>
            {value.map((v) => (
              <div
                key={v.key}
                className="grid grid-cols-[1fr_1fr_9.5rem_6rem_auto] items-center gap-2"
              >
                <Input
                  value={v.groupName}
                  onChange={(e) => update(v.key, { groupName: e.target.value })}
                  placeholder="Délka"
                />
                <Input
                  value={v.label}
                  onChange={(e) => update(v.key, { label: e.target.value })}
                  placeholder="18 cm"
                />
                <ColorPicker
                  value={v.hexColor}
                  onChange={(hex) => update(v.key, { hexColor: hex })}
                />
                <Input
                  type="number"
                  step={1}
                  value={v.priceCzk}
                  onChange={(e) => update(v.key, { priceCzk: e.target.value })}
                  placeholder={String(basePriceCzk)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Odebrat variantu"
                  onClick={() => remove(v.key)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Button type="button" variant="outline" onClick={add} className="w-fit">
        <Plus className="size-4" />
        Přidat variantu
      </Button>
      {value.length > 0 && (
        <p className="text-muted-foreground text-xs">
          Cena je celková částka za tuhle konkrétní variantu (ne příplatek
          navíc k základní ceně). Barva je nepovinná — nech prázdné, pokud
          varianta nemá barevný odznak.
        </p>
      )}
    </div>
  );
}
