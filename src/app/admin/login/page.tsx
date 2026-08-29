import type { Metadata } from "next";

import { Logo } from "@/components/layout/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Přihlášení do administrace",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4">
      {/* Ambient ice glow to match the storefront */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(125,211,252,0.12), transparent 70%)",
        }}
      />
      <div className="border-border/60 bg-card w-full max-w-sm rounded-xl border p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo className="text-2xl" />
          <p className="text-muted-foreground text-sm">
            Administrace obchodu · pouze pro správce
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
