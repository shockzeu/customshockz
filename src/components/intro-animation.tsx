"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const LETTER_COUNT = 12; // "CUSTOMSHOCKZ"
const LETTERS = Array.from({ length: LETTER_COUNT }, (_, i) => i);
const letterDelay = (i: number) => ({ animationDelay: `${2350 + i * 70}ms` });

const DRAW_DURATION_MS = 4300; // matches the longest keyframe (halo: 0.2s delay + 4s)
const REDUCED_HOLD_MS = 900; // brief static beat instead of the full draw-in
const FADE_MS = 700;

/**
 * Neon-outline logo draw, shown once on every page load ahead of the real
 * content. The page underneath is already mounted — this is an opaque
 * overlay, so fading it out *is* the reveal (see the CSS block in
 * globals.css for why this is keyframes rather than framer-motion).
 */
export function IntroAnimation({ onDone }: { onDone?: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const t = setTimeout(
      () => setLeaving(true),
      reduced ? REDUCED_HOLD_MS : DRAW_DURATION_MS,
    );
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    document.documentElement.style.overflow = "";
    const t = setTimeout(() => {
      setGone(true);
      onDone?.();
    }, FADE_MS);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLeaving(true);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  if (gone) return null;

  return (
    <div
      role="dialog"
      aria-label="CustomShockz – úvod"
      className={cn(
        "bg-onyx fixed inset-0 z-[2147483000] flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out-quart",
        leaving ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <svg
        viewBox="0 0 3380 2700"
        role="img"
        aria-label="CustomShockz"
        className="block h-auto w-[min(86vw,1000px,97vh)] overflow-visible"
      >
        <defs>
          <path
            id="intro-w"
            fillRule="evenodd"
            d="M548 36L101 2085L101 2138L119 2188L139 2222L173 2259L212 2292L234 2304L269 2317L307 2322L2886 2321L3120 1246L2333 692L2352 606L2560 606L2534 732L2535 738L3148 1118L3335 262L3333 219L3323 181L3292 131L3259 94L3224 66L3192 48L3169 40L3138 35ZM1120 608L1335 606L1296 800L1566 969L1569 974L1555 1041L2340 1589L2344 1594L2310 1749L2097 1750L2136 1570L2134 1567L1521 1187L1466 1434L1194 1263L1086 1749L872 1750ZM2053 115L3135 115L3167 125L3199 148L3224 174L3250 215L3255 239L3254 261L3093 990L2623 698L2660 526L2287 526L2243 724L2248 731L3030 1281L2821 2241L1676 2240L1806 1649L1539 1480L1576 1315L2045 1607L1996 1831L2374 1831L2433 1557L1860 1156L1864 1156L1908 1184L2107 272L2109 231L2101 198L2085 164ZM614 115L1907 115L1944 128L1976 153L2002 182L2022 217L2029 238L2027 264L1853 1055L1385 761L1435 526L1056 527L771 1829L1150 1830L1241 1418L1249 1392L1716 1687L1592 2242L307 2242L287 2239L258 2226L205 2176L191 2153L180 2124L180 2098Z"
          />
          <path
            id="intro-c"
            d="M2050 112L2048 118L2074 154L2097 200L2105 233L2103 270L1905 1176L1854 1145L1848 1145L1846 1151L2429 1559L2370 1827L2002 1827L2049 1605L1579 1312L1573 1312L1570 1316L1535 1482L1801 1651L1672 2242L1677 2245L2824 2244L3034 1279L2248 725L2291 530L2653 530L2619 700L3090 993L3096 993L3258 263L3259 237L3254 213L3228 172L3202 145L3170 122L3135 111Z"
          />
          <path
            id="intro-l0"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M70 2467L37 2618L37 2631L43 2636L148 2636L158 2593L121 2569L113 2604L83 2604L85 2588L105 2500L135 2499L133 2518L169 2541L183 2475L175 2467Z"
          />
          <path
            id="intro-l1"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M299 2467L316 2489L287 2629L295 2636L399 2636L436 2467L394 2467L366 2598L363 2604L333 2603L363 2467Z"
          />
          <path
            id="intro-l2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M582 2467L567 2537L630 2582L625 2604L595 2604L598 2586L561 2563L548 2629L555 2636L660 2636L677 2560L614 2515L618 2499L647 2499L646 2513L682 2535L695 2475L688 2467Z"
          />
          <path
            id="intro-l3"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M949 2467L802 2467L827 2499L847 2500L817 2636L859 2636L888 2501L890 2499L900 2500L897 2514L939 2514Z"
          />
          <path
            id="intro-l4"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1096 2467L1061 2628L1069 2636L1173 2636L1208 2475L1201 2467ZM1161 2499L1139 2603L1108 2604L1130 2500Z"
          />
          <path
            id="intro-l5"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1327 2467L1345 2492L1313 2636L1355 2636L1371 2564L1374 2568L1382 2620L1419 2591L1435 2566L1436 2570L1421 2636L1463 2636L1500 2467L1456 2467L1407 2537L1392 2467Z"
          />
          <path
            id="intro-l6"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1642 2467L1627 2537L1690 2582L1686 2603L1655 2604L1658 2586L1621 2563L1607 2627L1615 2636L1720 2636L1737 2560L1674 2515L1678 2499L1707 2499L1706 2513L1742 2535L1755 2475L1747 2467Z"
          />
          <path
            id="intro-l7"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1940 2467L1875 2467L1893 2492L1861 2636L1903 2636L1920 2556L1894 2529L1927 2527ZM2017 2467L1953 2467L1970 2489L1961 2534L1959 2536L1913 2536L1942 2567L1953 2568L1938 2636L1980 2636Z"
          />
          <path
            id="intro-l8"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2159 2467L2125 2629L2133 2636L2237 2636L2272 2475L2264 2467ZM2224 2499L2225 2503L2203 2603L2172 2604L2193 2501L2195 2499Z"
          />
          <path
            id="intro-l9"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2417 2467L2382 2628L2389 2636L2494 2636L2504 2592L2467 2570L2459 2604L2428 2603L2451 2500L2482 2499L2479 2518L2515 2541L2529 2475L2522 2467Z"
          />
          <path
            id="intro-l10"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2717 2467L2653 2467L2671 2491L2639 2637L2680 2637L2695 2571L2688 2556L2702 2538ZM2801 2467L2756 2467L2701 2553L2723 2655L2763 2636L2749 2550Z"
          />
          <path
            id="intro-l11"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2944 2467L2932 2520L2978 2499L2993 2500L2907 2636L3022 2636L3033 2583L2988 2604L2972 2603L3058 2467Z"
          />
          <filter id="intro-b1" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="34" />
          </filter>
          <filter id="intro-b2" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="60" />
          </filter>
          <filter id="intro-b3" x="-10%" y="-40%" width="120%" height="180%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <radialGradient id="intro-bl">
            <stop offset="0" stopColor="#5CE1E6" stopOpacity=".42" />
            <stop offset=".55" stopColor="#5CE1E6" stopOpacity=".1" />
            <stop offset="1" stopColor="#5CE1E6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse
          className="cs-intro-bloom"
          cx="1690"
          cy="1200"
          rx="2200"
          ry="1400"
          fill="url(#intro-bl)"
        />

        <g className="cs-intro-halo" filter="url(#intro-b1)">
          <path
            className="cs-intro-line cs-intro-halo-line"
            pathLength="1"
            d="M548 36L101 2085L101 2138L119 2188L139 2222L173 2259L212 2292L234 2304L269 2317L307 2322L2886 2321L3120 1246L2333 692L2352 606L2560 606L2534 732L2535 738L3148 1118L3335 262L3333 219L3323 181L3292 131L3259 94L3224 66L3192 48L3169 40L3138 35Z"
          />
          <path
            className="cs-intro-line cs-intro-halo-line"
            pathLength="1"
            d="M1120 608L1335 606L1296 800L1566 969L1569 974L1555 1041L2340 1589L2344 1594L2310 1749L2097 1750L2136 1570L2134 1567L1521 1187L1466 1434L1194 1263L1086 1749L872 1750Z"
          />
          <path
            className="cs-intro-line cs-intro-halo-line"
            pathLength="1"
            d="M2053 115L3135 115L3167 125L3199 148L3224 174L3250 215L3255 239L3254 261L3093 990L2623 698L2660 526L2287 526L2243 724L2248 731L3030 1281L2821 2241L1676 2240L1806 1649L1539 1480L1576 1315L2045 1607L1996 1831L2374 1831L2433 1557L1860 1156L1864 1156L1908 1184L2107 272L2109 231L2101 198L2085 164Z"
          />
          <path
            className="cs-intro-line cs-intro-halo-line"
            pathLength="1"
            d="M614 115L1907 115L1944 128L1976 153L2002 182L2022 217L2029 238L2027 264L1853 1055L1385 761L1435 526L1056 527L771 1829L1150 1830L1241 1418L1249 1392L1716 1687L1592 2242L307 2242L287 2239L258 2226L205 2176L191 2153L180 2124L180 2098Z"
          />
        </g>

        <g className="cs-intro-cyan-glow" filter="url(#intro-b2)">
          <use href="#intro-c" fill="#5CE1E6" />
        </g>
        <use className="cs-intro-cyan" href="#intro-c" fill="#5CE1E6" />
        <use className="cs-intro-white" href="#intro-w" fill="#fff" />

        <g className="cs-intro-core">
          <path
            className="cs-intro-line cs-intro-core-line"
            pathLength="1"
            d="M548 36L101 2085L101 2138L119 2188L139 2222L173 2259L212 2292L234 2304L269 2317L307 2322L2886 2321L3120 1246L2333 692L2352 606L2560 606L2534 732L2535 738L3148 1118L3335 262L3333 219L3323 181L3292 131L3259 94L3224 66L3192 48L3169 40L3138 35Z"
          />
          <path
            className="cs-intro-line cs-intro-core-line"
            pathLength="1"
            d="M1120 608L1335 606L1296 800L1566 969L1569 974L1555 1041L2340 1589L2344 1594L2310 1749L2097 1750L2136 1570L2134 1567L1521 1187L1466 1434L1194 1263L1086 1749L872 1750Z"
          />
          <path
            className="cs-intro-line cs-intro-core-line"
            pathLength="1"
            d="M2053 115L3135 115L3167 125L3199 148L3224 174L3250 215L3255 239L3254 261L3093 990L2623 698L2660 526L2287 526L2243 724L2248 731L3030 1281L2821 2241L1676 2240L1806 1649L1539 1480L1576 1315L2045 1607L1996 1831L2374 1831L2433 1557L1860 1156L1864 1156L1908 1184L2107 272L2109 231L2101 198L2085 164Z"
          />
          <path
            className="cs-intro-line cs-intro-core-line"
            pathLength="1"
            d="M614 115L1907 115L1944 128L1976 153L2002 182L2022 217L2029 238L2027 264L1853 1055L1385 761L1435 526L1056 527L771 1829L1150 1830L1241 1418L1249 1392L1716 1687L1592 2242L307 2242L287 2239L258 2226L205 2176L191 2153L180 2124L180 2098Z"
          />
        </g>

        <g className="cs-intro-word-glow" filter="url(#intro-b3)">
          {LETTERS.map((i) => (
            <g key={i} className="cs-intro-letter" style={letterDelay(i)}>
              <use href={`#intro-l${i}`} fill="#5CE1E6" />
            </g>
          ))}
        </g>
        <g>
          {LETTERS.map((i) => (
            <g key={i} className="cs-intro-letter" style={letterDelay(i)}>
              <use href={`#intro-l${i}`} fill="#5CE1E6" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
