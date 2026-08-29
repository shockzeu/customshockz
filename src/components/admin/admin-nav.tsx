"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Watch, Palette, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { title: "Přehled", href: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Objednávky", href: "/admin/orders", icon: ShoppingBag },
  { title: "Produkty", href: "/admin/products", icon: Watch },
  { title: "Varianty dílů", href: "/admin/parts", icon: Palette },
];

export function AdminNav({ horizontal = false }: { horizontal?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex gap-1",
        horizontal ? "flex-row overflow-x-auto" : "flex-col",
      )}
    >
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              active
                ? "bg-accent text-ice"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
}
