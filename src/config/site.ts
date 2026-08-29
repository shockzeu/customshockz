/**
 * Central brand + navigation config for CustomShockz.
 * Keep marketing copy and links here so components stay presentational.
 */
export const siteConfig = {
  name: "CustomShockz",
  tagline: "Iced Out Custom G-Shock",
  description:
    "Ručně upravené a iced-out custom G-Shock hodinky. Streetwear estetika, limitované kusy, každý kousek originál.",
  url: "https://customshockz.eu",
  instagram: "https://instagram.com/CustomShockz",
  instagramHandle: "@CustomShockz",
  email: "customshockzz@gmail.com",
  /** Bank transfer target — shown to customers who pick that payment method. */
  bankAccount: "112200621/5500",
} as const;

export type NavItem = {
  title: string;
  href: string;
};

/** Primary navigation — routes are placeholders wired up in later phases. */
export const mainNav: NavItem[] = [
  { title: "Hodinky", href: "/hodinky" },
  { title: "Šperky", href: "/sperky" },
  { title: "Na míru", href: "/na-miru" },
  { title: "O nás", href: "/o-nas" },
  { title: "Kontakt", href: "/kontakt" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Obchod",
    items: [
      { title: "Hodinky", href: "/hodinky" },
      { title: "Šperky", href: "/sperky" },
      { title: "Zakázka na míru", href: "/na-miru" },
      { title: "Dárkové poukazy", href: "/poukazy" },
    ],
  },
  {
    title: "Informace",
    items: [
      { title: "O značce", href: "/o-nas" },
      { title: "Doprava a platba", href: "/doprava" },
      { title: "Reklamace", href: "/reklamace" },
    ],
  },
  {
    title: "Právní",
    items: [
      { title: "Obchodní podmínky", href: "/obchodni-podminky" },
      { title: "Ochrana osobních údajů", href: "/gdpr" },
    ],
  },
];
