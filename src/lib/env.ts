/**
 * Centralized environment access.
 *
 * Phase 1: nothing here is required yet — the getters return `undefined`
 * when unset so the app runs without any secrets. In later phases, tighten
 * these (e.g. throw on missing values, or validate with zod) once Stripe
 * and Supabase are actually wired up.
 */

function optional(key: string): string | undefined {
  return process.env[key] || undefined;
}

export const env = {
  // Supabase (Phase: DB / auth)
  supabaseUrl: optional("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: optional("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: optional("SUPABASE_SERVICE_ROLE_KEY"),

  // Stripe (Phase: checkout / payments)
  stripeSecretKey: optional("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: optional("STRIPE_WEBHOOK_SECRET"),
  stripePublishableKey: optional("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),

  // Resend (order confirmation / notification emails)
  resendApiKey: optional("RESEND_API_KEY"),
  /** Verified sender — defaults to Resend's shared test domain until customshockz.eu is verified. */
  emailFrom: optional("EMAIL_FROM") ?? "CustomShockz <onboarding@resend.dev>",

  // App
  siteUrl: optional("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
} as const;
