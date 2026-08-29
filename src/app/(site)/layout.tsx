import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
