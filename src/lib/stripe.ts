/**
 * Stripe integration — PLACEHOLDER (Phase 1).
 *
 * The `stripe` package is intentionally NOT installed yet. When you start the
 * payments phase:
 *
 *   1. npm install stripe @stripe/stripe-js
 *   2. Uncomment the block below.
 *   3. Add STRIPE_SECRET_KEY (+ webhook + publishable) to .env.local — see .env.example.
 *
 * import Stripe from "stripe";
 * import { env } from "@/lib/env";
 *
 * if (!env.stripeSecretKey) {
 *   throw new Error("STRIPE_SECRET_KEY is not set");
 * }
 *
 * export const stripe = new Stripe(env.stripeSecretKey, {
 *   apiVersion: "2025-01-27.acacia",
 *   typescript: true,
 * });
 */

export const STRIPE_READY = false;
