"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2, Upload, X } from "lucide-react";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  type ProductCategory,
  type ProductOptionRow,
  type ProductRow,
} from "@/types";
import { saveProduct, saveProductOptions } from "@/app/admin/(panel)/products/actions";
import {
  ProductVariantsEditor,
  optionRowsToDrafts,
  type VariantDraft,
} from "@/components/admin/product-variants-editor";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
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

type PhotoItem = { key: string; url: string; file?: File };

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
  options = [],
  children,
}: {
  product?: ProductRow;
  options?: ProductOptionRow[];
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
  const [material, setMaterial] = useState(product?.material ?? "");
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
  // One ordered list for already-uploaded photos and newly picked files, so
  // they can be interleaved/reordered freely; `file` marks the ones still to upload.
  const [photos, setPhotos] = useState<PhotoItem[]>(() =>
    initialUrls.map((url, i) => ({ key: `${i}-${url}`, url })),
  );
  const [variants, setVariants] = useState<VariantDraft[]>(() =>
    optionRowsToDrafts(options, product ? product.base_price / 100 : 0),
  );
  const [saving, setSaving] = useState(false);
  const blobUrls = useRef(new Set<string>());
  const dragFrom = useRef<number | null>(null);

  useEffect(() => {
    const urls = blobUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  function addFiles(files: File[]) {
    const items = files.map((file) => {
      const url = URL.createObjectURL(file);
      blobUrls.current.add(url);
      return { key: url, url, file };
    });
    setPhotos((p) => [...p, ...items]);
  }

  function removePhoto(key: string) {
    setPhotos((p) => p.filter((x) => x.key !== key));
    if (blobUrls.current.delete(key)) URL.revokeObjectURL(key);
  }

  function movePhoto(from: number, to: number) {
    setPhotos((p) => {
      if (from === to || to < 0 || to >= p.length) return p;
      const next = [...p];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function resetForNew() {
    if (!isEdit) {
      setName("");
      setCategory("watches");
      setSlug("");
      setSlugTouched(false);
      setDescription("");
      setMaterial("");
      setPrice("");
      setInStock(true);
      setActive(true);
      setCodAllowed(false);
      blobUrls.current.forEach((u) => URL.revokeObjectURL(u));
      blobUrls.current.clear();
      setPhotos([]);
      setVariants([]);
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

    const imageUrls: string[] = [];
    const supabase = createClient();

    for (const photo of photos) {
      if (!photo.file) {
        imageUrls.push(photo.url);
        continue;
      }
      const ext = photo.file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, photo.file, { upsert: false });

      if (upErr) {
        toast.error("Nahrání obrázku selhalo", { description: upErr.message });
        setSaving(false);
        return;
      }
      imageUrls.push(
        supabase.storage.from("product-images").getPublicUrl(path).data
          .publicUrl,
      );
    }

    const finalSlug = slug || slugify(name);

    const res = await saveProduct({
      id: product?.id,
      name,
      category,
      slug: finalSlug,
      description,
      material,
      imageUrls,
      basePriceCzk: Number(price) || 0,
      inStock,
      isActive: active,
      codAllowed,
    });

    if (res.error || !res.id) {
      setSaving(false);
      toast.error("Uložení selhalo", { description: res.error });
      return;
    }

    const basePriceCzk = Number(price) || 0;
    const optionsRes = await saveProductOptions(
      res.id,
      finalSlug,
      variants.map((v) => ({
        groupName: v.groupName,
        label: v.label,
        hexColor: v.hexColor || null,
        imageUrl: v.imageUrl,
        priceModifierCzk: (Number(v.priceCzk) || 0) - basePriceCzk,
      })),
    );

    setSaving(false);

    if (optionsRes.error) {
      toast.error("Uložení variant selhalo", { description: optionsRes.error });
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
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
              <Label htmlFor="p-material">Materiál</Label>
              <Input
                id="p-material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="925 stříbro"
              />
              <p className="text-muted-foreground text-xs">
                Zobrazí se jako odznak na stránce produktu.
              </p>
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
              <Label>Varianty (barva, délka, ...)</Label>
              <ProductVariantsEditor
                value={variants}
                onChange={setVariants}
                basePriceCzk={Number(price) || 0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="p-image">Fotky (volitelné)</Label>
              {photos.length > 0 && (
                <>
                  <p className="text-muted-foreground text-xs">
                    Pořadí měníš šipkami nebo přetažením. Fotka č. 1 je titulní.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {photos.map((photo, i) => (
                      <div
                        key={photo.key}
                        draggable
                        onDragStart={() => (dragFrom.current = i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (dragFrom.current !== null) movePhoto(dragFrom.current, i);
                          dragFrom.current = null;
                        }}
                        className={cn(
                          "relative size-24 shrink-0 cursor-grab overflow-hidden rounded-md border active:cursor-grabbing",
                          i === 0 ? "border-ice-blue border-2" : "border-border/60",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.url}
                          alt=""
                          draggable={false}
                          className="size-full object-cover"
                        />
                        <span className="absolute top-1 left-1 rounded bg-black/75 px-1.5 text-[11px] font-semibold text-white">
                          {i === 0 ? "1 · titulní" : i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.key)}
                          aria-label="Odebrat fotku"
                          className="absolute top-1 right-1 rounded-full bg-black/75 p-0.5 text-white"
                        >
                          <X className="size-3" />
                        </button>
                        <div className="absolute inset-x-1 bottom-1 flex justify-between">
                          <button
                            type="button"
                            onClick={() => movePhoto(i, i - 1)}
                            disabled={i === 0}
                            aria-label="Posunout dopředu"
                            className="rounded-full bg-black/75 p-0.5 text-white disabled:opacity-0"
                          >
                            <ChevronLeft className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => movePhoto(i, i + 1)}
                            disabled={i === photos.length - 1}
                            aria-label="Posunout dozadu"
                            className="rounded-full bg-black/75 p-0.5 text-white disabled:opacity-0"
                          >
                            <ChevronRight className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
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
                  addFiles(Array.from(e.target.files ?? []));
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
