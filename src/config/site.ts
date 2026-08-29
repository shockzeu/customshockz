/**
 * Central brand + navigation config for CustomShockz.
 * Keep marketing copy and links here so components stay presentational.
 */
export const siteConfig = {
  name: "CustomShockz",
  tagline: "Iced Out Custom G-Shock",
  description:
    "Ručně upravené a iced-out custom G-Shock hodinky. Streetwear estetika, limitované kusy, každý kousek originál.",
  // Update to the production domain before deploy.
  url: "https://customshockz.com",
  instagram: "https://instagram.com/CustomShockz",
  instagramHandle: "@CustomShockz",
  email: "info@customshockz.com",
} as const;

export type NavItem = {
  title: string;
  href: string;
};

/** Primary navigation — routes are placeholders wired up in later phases. */
export const mainNav: NavItem[] = [
  { title: "Kolekce", href: "/kolekce" },
  { title: "Na míru", href: "/na-miru" },
  { title: "O nás", href: "/o-nas" },
  { title: "Kontakt", href: "/kontakt" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Obchod",
    items: [
      { title: "Kolekce", href: "/kolekce" },
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
