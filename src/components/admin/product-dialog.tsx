"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";

import type { ProductRow } from "@/types";
import { saveProduct } from "@/app/admin/(panel)/products/actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductDialog({
  product,
  children,
}: {
  product?: ProductRow;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    product ? String(product.base_price / 100) : "",
  );
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [active, setActive] = useState(product?.is_active ?? true);
  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.image_url ?? null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function resetForNew() {
    if (!isEdit) {
      setName("");
      setSlug("");
      setSlugTouched(false);
      setDescription("");
      setPrice("");
      setInStock(true);
      setActive(true);
      setImageUrl(null);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let finalImageUrl = imageUrl;

    if (file) {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false });

      if (upErr) {
        toast.error("Nahrání obrázku selhalo", { description: upErr.message });
        setSaving(false);
        return;
      }
      finalImageUrl = supabase.storage.from("product-images").getPublicUrl(
        path,
      ).data.publicUrl;
    }

    const res = await saveProduct({
      id: product?.id,
      name,
      slug: slug || slugify(name),
      description,
      imageUrl: finalImageUrl,
      basePriceCzk: Number(price) || 0,
      inStock,
      isActive: active,
    });

    setSaving(false);

    if (res.error) {
      toast.error("Uložení selhalo", { description: res.error });
      return;
    }

    toast.success(isEdit ? "Produkt upraven" : "Produkt přidán");
    setOpen(false);
    resetForNew();
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) resetForNew();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Upravit produkt" : "Nový produkt"}
            </DialogTitle>
            <DialogDescription>
              Základní model hodinek. Cena je v Kč.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="p-name">Název</Label>
              <Input
                id="p-name"
                required
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Frostbite GA-2100"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="p-slug">Slug (v URL)</Label>
              <Input
                id="p-slug"
                required
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="frostbite-ga2100"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="p-desc">Popis</Label>
              <Textarea
                id="p-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Plně iced-out CasiOak s ručně sazenými kameny…"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="p-price">Základní cena (Kč)</Label>
              <Input
                id="p-price"
                type="number"
                min={0}
                step={1}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="12900"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="p-image">Fotka (volitelné)</Label>
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
                  {file ? file.name : imageUrl ? "Aktuální fotka" : "Žádný soubor"}
                </span>
                {(file || imageUrl) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setFile(null);
                      setImageUrl(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    aria-label="Odebrat fotku"
                  >
                    <X className="size-4" />
                  </Button>
                )}
                <input
                  ref={fileRef}
                  id="p-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2.5">
              <Label htmlFor="p-instock" className="cursor-pointer">
                Skladem
              </Label>
              <Switch
                id="p-instock"
                checked={inStock}
                onCheckedChange={setInStock}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2.5">
              <Label htmlFor="p-active" className="cursor-pointer">
                Aktivní (viditelný v obchodě)
              </Label>
              <Switch id="p-active" checked={active} onCheckedChange={setActive} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Zrušit
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Uložit" : "Přidat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
