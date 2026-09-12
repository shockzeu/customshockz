"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  type ProductCategory,
  type ProductRow,
} from "@/types";
import { saveProduct } from "@/app/admin/(panel)/products/actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? "watches",
  );
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    product ? String(product.base_price / 100) : "",
  );
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [active, setActive] = useState(product?.is_active ?? true);
  const [codAllowed, setCodAllowed] = useState(product?.cod_allowed ?? false);
  const initialUrls =
    product?.image_urls?.length
      ? product.image_urls
      : product?.image_url
        ? [product.image_url]
        : [];
  const [existingUrls, setExistingUrls] = useState<string[]>(initialUrls);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  // Preview entries in display order: kept existing photos first, then newly
  // picked files (as local object URLs). Memoized on `newFiles` itself so a
  // blob URL is only (re)created when the file list actually changes, not on
  // every render — the cleanup below then reliably revokes the exact set it
  // created instead of leaking one per re-render.
  const newFilePreviews = useMemo(
    () => newFiles.map((f) => URL.createObjectURL(f)),
    [newFiles],
  );
  useEffect(() => {
    return () => newFilePreviews.forEach((u) => URL.revokeObjectURL(u));
  }, [newFilePreviews]);
  const previews = [...existingUrls, ...newFilePreviews];

  function removeExisting(url: string) {
    setExistingUrls((u) => u.filter((x) => x !== url));
  }
  function removeNewFile(index: number) {
    setNewFiles((f) => f.filter((_, i) => i !== index));
  }

  function resetForNew() {
    if (!isEdit) {
      setName("");
      setCategory("watches");
      setSlug("");
      setSlugTouched(false);
      setDescription("");
      setPrice("");
      setInStock(true);
      setActive(true);
      setCodAllowed(false);
      setExistingUrls([]);
      setNewFiles([]);
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

    const uploadedUrls: string[] = [];

    if (newFiles.length) {
      const supabase = createClient();
      for (const f of newFiles) {
        const ext = f.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("product-images")
          .upload(path, f, { upsert: false });

        if (upErr) {
          toast.error("Nahrání obrázku selhalo", { description: upErr.message });
          setSaving(false);
          return;
        }
        uploadedUrls.push(
          supabase.storage.from("product-images").getPublicUrl(path).data
            .publicUrl,
        );
      }
    }

    const res = await saveProduct({
      id: product?.id,
      name,
      category,
      slug: slug || slugify(name),
      description,
      imageUrls: [...existingUrls, ...uploadedUrls],
      basePriceCzk: Number(price) || 0,
      inStock,
      isActive: active,
      codAllowed,
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
              Hodinky nebo šperk k prodeji. Cena je v Kč.
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
              <Label>Kategorie</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as ProductCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {PRODUCT_CATEGORY_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="p-image">Fotky (volitelné, první je titulní)</Label>
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {previews.map((url, i) => {
                    const isExisting = i < existingUrls.length;
                    return (
                      <div
                        key={url}
                        className="border-border/60 relative size-16 shrink-0 overflow-hidden rounded-md border"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="size-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            isExisting
                              ? removeExisting(url)
                              : removeNewFile(i - existingUrls.length)
                          }
                          aria-label="Odebrat fotku"
                          className="absolute top-0.5 right-0.5 rounded-full bg-black/70 p-0.5 text-white"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                className="w-fit"
              >
                <Upload className="size-4" />
                Přidat fotky
              </Button>
              <input
                ref={fileRef}
                id="p-image"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const picked = Array.from(e.target.files ?? []);
                  setNewFiles((f) => [...f, ...picked]);
                  e.target.value = "";
                }}
              />
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
              <div>
                <Label htmlFor="p-cod" className="cursor-pointer">
                  Povolit dobírku
                </Label>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Vypnuto = jen platba předem. Doporučeno pro kusy na míru.
                </p>
              </div>
              <Switch
                id="p-cod"
                checked={codAllowed}
                onCheckedChange={setCodAllowed}
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
