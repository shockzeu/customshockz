import Link from "next/link";

import { footerNav, siteConfig } from "@/config/site";
import { Logo } from "@/components/layout/logo";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-border/60 bg-onyx-surface/40 border-t">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-ice inline-flex items-center gap-2 text-sm transition-colors"
            >
              <InstagramIcon className="size-4" />
              {siteConfig.instagramHandle}
            </a>
          </div>

          {footerNav.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-ice text-xs font-semibold tracking-widest uppercase">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border/60 text-muted-foreground mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Všechna práva
            vyhrazena.
          </p>
          <p>
            Každý kus je originál · Handmade in EU
          </p>
        </div>
      </div>
    </footer>
  );
}
