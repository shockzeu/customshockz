import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { siteConfig } from "@/config/site";

// Self-imposed pre-launch lock — see the comment on `siteConfig.launchAt`.
// Once the countdown is over, delete this block (and the `launchAtMs` check
// below), plus `src/app/pripravujeme/`.
const launchAtMs = new Date(siteConfig.launchAt).getTime();

// Next.js 16 renamed Middleware → Proxy. Same functionality.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin keeps its own auth guard regardless of the launch lock, so work
  // can continue there while the public storefront shows the countdown.
  if (pathname.startsWith("/admin")) {
    return await updateSession(request);
  }

  if (Date.now() < launchAtMs) {
    return NextResponse.rewrite(new URL("/pripravujeme", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|pripravujeme|_next/static|_next/image|favicon.ico|icon|opengraph-image|twitter-image|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?)$).*)",
  ],
};
