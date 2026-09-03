"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Layers, Loader2 } from "lucide-react";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  type ProductCategory,
} from "@/types";
import { createProductBatch } from "@/app/admin/(panel)/products/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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

const COUNT_PRESETS = [5, 7, 10];

export function BatchCreateDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [batchLabel, setBatchLabel] = useState("");
  const [count, setCount] = useState(5);
  const [category, setCategory] = useState<ProductCategory>("watches");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setBatchLabel("");
    setCount(5);
    setCategory("watches");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await createProductBatch({ batchLabel, count, category });

    setSaving(false);

    if (res.error) {
      toast.error("Založení dávky selhalo", { description: res.error });
      return;
    }

    toast.success(`Založeno ${res.count} skrytých produktů`, {
      description: "Vyplň je jednotlivě a pak dávku zveřejni najednou.",
    });
    setOpen(false);
    resetForm();
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Layers className="size-4" />
          Vytvořit dávku
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Vytvořit dávku produktů</DialogTitle>
            <DialogDescription>
              Založí zadaný počet skrytých produktů najednou. Vyplníš je
              postupně přes úpravu, na webu se neukážou — dokud dávku
              nezveřejníš, pak naskočí všechny naráz.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="b-label">Název dávky</Label>
              <Input
                id="b-label"
                required
                value={batchLabel}
                onChange={(e) => setBatchLabel(e.target.value)}
                placeholder="Podzimní kolekce"
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
              <Label htmlFor="b-count">Počet kusů</Label>
              <div className="flex flex-wrap items-center gap-2">
                {COUNT_PRESETS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setCount(n)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                      count === n
                        ? "border-ice-blue bg-ice-blue/10 text-foreground"
                        : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    {n}
                  </button>
                ))}
                <Input
                  id="b-count"
                  type="number"
                  min={1}
                  max={50}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value) || 1)}
                  className="w-24"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Zrušit
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Založit dávku
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
