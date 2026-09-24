import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { CountdownLock } from "@/components/countdown-lock";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** 1080x1080 export target for the IG countdown post — screenshot this route. */
export default function PripravujemeIgPage() {
  return (
    <div className="mx-auto" style={{ width: 1080, height: 1080 }}>
      <CountdownLock targetIso={siteConfig.launchAt} square />
    </div>
  );
}
