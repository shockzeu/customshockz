import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { CountdownLock } from "@/components/countdown-lock";
import { IntroAnimation } from "@/components/intro-animation";

export const metadata: Metadata = {
  title: `Připravujeme · ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default function PripravujemePage() {
  return (
    <>
      <IntroAnimation />
      <CountdownLock targetIso={siteConfig.launchAt} />
    </>
  );
}
