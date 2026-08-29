"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Upload, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { savePartVariant } from "@/app/admin/(panel)/parts/actions";
import { PART_TYPES, PART_TYPE_LABELS, type PartType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "@/components/admin/color-picker";

export function PartForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [partType, setPartType] = useState<PartType>("case");
  const [label, setLabel] = useState("");
  const [hex, setHex] = useState("#7DD3FC");
  const [priceMod, setPriceMod] = useState("0");
  const [file, setFile] = useState<File | null>(null);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  function reset() {
    setLabel("");
    setHex("#7DD3FC");
    setPriceMod("0");
    setFile(null);
    setActive(true);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let imageUrl: string | null = null;

    // Optional image upload to Supabase Storage.
    if (file) {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${partType}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("part-images")
        .upload(path, file, { upsert: false });

      if (upErr) {
        toast.error("Nahrání obrázku selhalo", { description: upErr.message });
        setSaving(false);
        return;
      }
      imageUrl = supabase.storage.from("part-images").getPublicUrl(path)
        .data.publicUrl;
    }

    const res = await savePartVariant({
      part_type: partType,
      label,
      hex_color: hex,
      image_url: imageUrl,
      priceModifierCzk: Number(priceMod) || 0,
      is_active: active,
    });

    setSaving(false);

    if (res.error) {
      toast.error("Uložení selhalo", { description: res.error });
      return;
    }

    toast.success("Varianta přidána");
    reset();
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Přidat variantu dílu</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Typ dílu</Label>
            <Select
              value={partType}
              onValueChange={(v) => setPartType(v as PartType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PART_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {PART_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pv-label">Název varianty</Label>
            <Input
              id="pv-label"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ledově modrá"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pv-hex">Barva</Label>
            <ColorPicker id="pv-hex" value={hex} onChange={setHex} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pv-price">Příplatek (Kč, může být záporný)</Label>
            <Input
              id="pv-price"
              type="number"
              step={1}
              value={priceMod}
              onChange={(e) => setPriceMod(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pv-image">Obrázek (volitelné)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                className="shrink-0"
              >
                <Upload className="size-4" />
                Vybrat
              </Button>
              <span className="text-muted-foreground truncate text-sm">
                {file ? file.name : "Žádný soubor"}
              </span>
              {file && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  aria-label="Zrušit obrázek"
                >
                  <X className="size-4" />
                </Button>
              )}
              <input
                ref={fileRef}
                id="pv-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2.5 sm:col-span-2">
            <Label htmlFor="pv-active" className="cursor-pointer">
              Aktivní
            </Label>
            <Switch
              id="pv-active"
              checked={active}
              onCheckedChange={setActive}
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Přidat variantu
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
