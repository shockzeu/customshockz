import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/layout/navbar";
import { TrustBar } from "@/components/layout/trust-bar";
import { Footer } from "@/components/layout/footer";
import { IntroAnimation } from "@/components/intro-animation";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {/* Lives in the layout, not each page, so it plays once per fresh
          visit/reload — not on every internal <Link> navigation. */}
      <IntroAnimation />
      <div className="flex min-h-full flex-col">
        <TrustBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
