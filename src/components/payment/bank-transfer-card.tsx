"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — the value is still visible to select manually.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          {label}
        </p>
        <p className="text-foreground truncate font-medium">{value}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={handleCopy}
        aria-label={`Zkopírovat ${label.toLowerCase()}`}
      >
        {copied ? (
          <Check className="size-4 text-ice-blue" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function BankTransferCard({
  qrSrc,
  account,
  variableSymbol,
  amountLabel,
}: {
  qrSrc: string;
  account: string;
  variableSymbol: string;
  amountLabel: string;
}) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
      <div
        className={cn(
          "border-border/60 mx-auto rounded-xl border bg-white p-3 sm:mx-0",
        )}
      >
        <Image
          src={qrSrc}
          alt="QR kód pro platbu"
          width={180}
          height={180}
          unoptimized
        />
        <p className="mt-2 max-w-[180px] text-center text-[11px] leading-tight text-neutral-600">
          Naskenuj v bankovní aplikaci
        </p>
      </div>

      <div className="divide-border/60 divide-y">
        <CopyField label="Číslo účtu" value={account} />
        <CopyField label="Variabilní symbol" value={variableSymbol} />
        <CopyField label="Částka" value={amountLabel} />
      </div>
    </div>
  );
}
