"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ProductImageState = {
  activeUrl: string | null;
  setActiveUrl: (url: string) => void;
};

const ProductImageContext = createContext<ProductImageState | null>(null);

/** Shares the big gallery photo between the gallery and the variant picker on a product page. */
export function ProductImageProvider({
  initialUrl,
  children,
}: {
  initialUrl: string | null;
  children: ReactNode;
}) {
  const [activeUrl, setActiveUrl] = useState(initialUrl);
  return (
    <ProductImageContext.Provider value={{ activeUrl, setActiveUrl }}>
      {children}
    </ProductImageContext.Provider>
  );
}

export function useProductImage() {
  const ctx = useContext(ProductImageContext);
  if (!ctx) throw new Error("useProductImage must be used inside ProductImageProvider");
  return ctx;
}
