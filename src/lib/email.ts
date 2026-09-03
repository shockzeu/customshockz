import { Resend } from "resend";

import { env } from "@/lib/env";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/types";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

type OrderEmailItem = {
  name: string;
  configSummary: string | null;
  quantity: number;
  unitPriceCzk: number;
};

type OrderEmailInput = {
  orderId: string;
  orderNumber: number;
  customerName: string;
  email: string;
  phone: string | null;
  addressStreet: string;
  addressCity: string;
  addressZip: string;
  paymentMethod: PaymentMethod;
  note: string | null;
  items: OrderEmailItem[];
  totalCzk: number;
};

function itemsTableHtml(items: OrderEmailItem[]) {
  const rows = items
    .map(
      (item) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #222;">
          ${item.name}${
            item.configSummary
              ? `<br><span style="color:#888;font-size:12px;">${item.configSummary}</span>`
              : ""
          } × ${item.quantity}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #222;text-align:right;white-space:nowrap;">
          ${formatPrice(item.unitPriceCzk * item.quantity)}
        </td>
      </tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin-top:16px;">${rows}</table>`;
}

/**
 * Sends the customer confirmation + admin notification for a new order.
 * No-op when RESEND_API_KEY isn't configured — the order is still saved
 * either way, this just skips the email step silently.
 */
export async function sendOrderEmails(input: OrderEmailInput) {
  if (!resend) return;

  const shortId = input.orderId.slice(0, 8);
  const itemsTable = itemsTableHtml(input.items);
  const variableSymbol = String(input.orderNumber);
  const paymentLabel = PAYMENT_METHOD_LABELS[input.paymentMethod];

  const customerHtml = `
    <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;color:#111;">
      <h2>Díky za objednávku, ${input.customerName}!</h2>
      <p>Přijali jsme ji a ozveme se ti co nejdřív na tento e-mail s dalšími kroky.</p>
      ${itemsTable}
      <p style="margin-top:16px;font-size:18px;"><strong>Celkem: ${formatPrice(input.totalCzk)}</strong></p>
      <p>Způsob platby: ${paymentLabel}</p>
      ${
        input.paymentMethod === "bank_transfer"
          ? `<p>Číslo účtu: <strong>${siteConfig.bankAccount}</strong><br>
             Variabilní symbol: <strong>${variableSymbol}</strong><br>
             Částka: <strong>${formatPrice(input.totalCzk)}</strong></p>`
          : ""
      }
      <p style="margin-top:24px;color:#888;font-size:12px;">Objednávka č. ${input.orderNumber} (#${shortId})</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;color:#111;">
      <h2>Nová objednávka č. ${input.orderNumber}</h2>
      <p><strong>${input.customerName}</strong> — ${input.email}${input.phone ? ` · ${input.phone}` : ""}</p>
      <p>${input.addressStreet}, ${input.addressZip} ${input.addressCity}</p>
      <p>Platba: ${paymentLabel}</p>
      ${input.note ? `<p>Poznámka: ${input.note}</p>` : ""}
      ${itemsTable}
      <p style="margin-top:16px;font-size:18px;"><strong>Celkem: ${formatPrice(input.totalCzk)}</strong></p>
    </div>
  `;

  await Promise.allSettled([
    resend.emails.send({
      from: env.emailFrom,
      to: input.email,
      subject: "Potvrzení objednávky — CustomShockz",
      html: customerHtml,
    }),
    resend.emails.send({
      from: env.emailFrom,
      to: siteConfig.email,
      subject: `Nová objednávka č. ${input.orderNumber} od ${input.customerName}`,
      html: adminHtml,
    }),
  ]);
}
