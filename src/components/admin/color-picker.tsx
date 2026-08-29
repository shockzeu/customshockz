"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Hex color input: native swatch picker synced with an editable text field. */
export function ColorPicker({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (hex: string) => void;
  id?: string;
}) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#7DD3FC";

  return (
    <div className="flex items-center gap-2">
      <label
        className="border-border/60 relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-md border"
        style={{ backgroundColor: safe }}
        aria-label="Vybrat barvu"
      >
        <input
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#7DD3FC"
        className={cn("font-mono uppercase")}
        maxLength={7}
      />
    </div>
  );
}
