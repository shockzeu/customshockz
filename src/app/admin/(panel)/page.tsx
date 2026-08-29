import Link from "next/link";
import { Watch, Palette, ArrowRight, TriangleAlert } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Přehled administrace",
  robots: { index: false, follow: false },
};

async function getStats() {
  try {
    const supabase = await createClient();
    const [products, activeProducts, parts] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase.from("part_variants").select("*", { count: "exact", head: true }),
    ]);

    const error = products.error ?? activeProducts.error ?? parts.error;
    if (error) return { error: error.message };

    return {
      products: products.count ?? 0,
      activeProducts: activeProducts.count ?? 0,
      parts: parts.count ?? 0,
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight uppercase">
          Přehled
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Správa katalogu CustomShockz.
        </p>
      </div>

      {"error" in stats ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2 text-base">
              <TriangleAlert className="size-4" />
              Databáze není připravená
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2 text-sm">
            <p>
              Nepodařilo se načíst data. Nejspíš ještě není spuštěné SQL schéma
              nebo chybí env proměnné.
            </p>
            <p className="text-xs">
              Detail: <code className="text-foreground">{stats.error}</code>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Produkty celkem" value={stats.products} />
          <StatCard label="Aktivní produkty" value={stats.activeProducts} />
          <StatCard label="Varianty dílů" value={stats.parts} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <ManageCard
          href="/admin/products"
          title="Produkty"
          description="Základní modely hodinek, ceny a dostupnost."
          icon={<Watch className="size-5" />}
        />
        <ManageCard
          href="/admin/parts"
          title="Varianty dílů"
          description="Pouzdra, číselníky, řemínky a iced-out lunety."
          icon={<Palette className="size-5" />}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className="font-heading text-ice text-4xl font-bold">{value}</span>
      </CardContent>
    </Card>
  );
}

function ManageCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="hover:border-ice-blue/50 group transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base">
          <span className="text-ice-blue">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <p className="text-muted-foreground text-sm">{description}</p>
        <Button asChild variant="ghost" size="sm" className="shrink-0">
          <Link href={href}>
            Spravovat
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
