import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/layout/logo";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense-in-depth: the proxy already guards /admin, this also covers
  // any request that slipped past it (and a not-yet-configured Supabase).
  let user = null;
  try {
    const supabase = await createClient();
    user = (await supabase.auth.getUser()).data.user;
  } catch {
    user = null;
  }

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-dvh">
      <aside className="border-border/60 bg-onyx-surface/40 sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r p-5 md:flex">
        <Link href="/admin" className="mb-8 px-2">
          <Logo />
        </Link>
        <AdminNav />
        <div className="border-border/60 mt-auto border-t pt-4">
          <p className="text-muted-foreground mb-3 truncate px-2 text-xs">
            {user.email}
          </p>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="border-border/60 bg-onyx-surface/40 flex items-center justify-between border-b px-4 py-3 md:hidden">
          <Link href="/admin">
            <Logo />
          </Link>
          <LogoutButton />
        </header>
        <div className="md:hidden">
          <div className="border-border/60 border-b px-4 py-2">
            <AdminNav horizontal />
          </div>
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
