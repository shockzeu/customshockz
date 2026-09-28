/**
 * Czech "QR Platba" (SPD) payment strings — scanning this in any CZ banking
 * app pre-fills account, amount, variable symbol and message, so customers
 * don't retype numbers by hand. Spec: https://qr-platba.cz (SPD 1.0).
 */

/** Converts a CZ account number like "112200621/5500" (optionally with a
 * "predčíslí" prefix, "19-112200621/5500") into its IBAN via the standard
 * mod-97 check-digit algorithm. */
export function czAccountToIban(accountAndBankCode: string): string {
  const [accountPart, bankCode] = accountAndBankCode.split("/");
  if (!bankCode) {
    throw new Error(`Invalid CZ account number: ${accountAndBankCode}`);
  }
  const [prefixRaw, accountRaw] = accountPart.includes("-")
    ? accountPart.split("-")
    : ["", accountPart];

  const bban =
    bankCode.padStart(4, "0") +
    prefixRaw.padStart(6, "0") +
    accountRaw.padStart(10, "0");

  // IBAN check-digit algorithm: move country code + "00" to the end,
  // convert letters to digits (C=12, Z=35), then check digits = 98 - (mod 97).
  const rearranged = `${bban}123500`;
  let remainder = 0;
  for (const digit of rearranged) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }
  const checkDigits = String(98 - remainder).padStart(2, "0");

  return `CZ${checkDigits}${bban}`;
}

/** Builds an SPD 1.0 payment string for the "QR Platba" standard. */
export function buildSpdString({
  iban,
  amountHaler,
  variableSymbol,
  message,
}: {
  iban: string;
  amountHaler: number;
  variableSymbol: string;
  message: string;
}): string {
  const amount = (amountHaler / 100).toFixed(2);
  // Diacritics are technically allowed but not every banking app's scanner
  // handles them reliably — keep MSG plain ASCII.
  const asciiMessage = message
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .slice(0, 60);

  return [
    "SPD*1.0",
    `ACC:${iban}`,
    `AM:${amount}`,
    "CC:CZK",
    `X-VS:${variableSymbol}`,
    `MSG:${asciiMessage}`,
  ].join("*");
}
