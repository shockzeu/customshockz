import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/layout/navbar";
import { TrustBar } from "@/components/layout/trust-bar";
import { Footer } from "@/components/layout/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex min-h-full flex-col">
        <TrustBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
