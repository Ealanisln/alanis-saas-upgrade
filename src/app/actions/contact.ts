"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { defaultLocale, isValidLocale } from "@/config/i18n";
import { CONTACT_LIMITS } from "@/lib/contact-limits";
import { sendContactEmail } from "@/lib/email";
import { verifyTurnstileToken } from "@/lib/turnstile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  locale: string;
  turnstileToken?: string;
}

export type ContactResult =
  { ok: true } | { ok: false; code: "invalid" | "verification" | "send" };

/**
 * Server actions are public endpoints, so the client-side constraints
 * (required fields, max lengths, email shape) are re-checked here before
 * the Turnstile token is verified and the email is sent.
 */
export async function submitContact(
  input: ContactSubmission,
): Promise<ContactResult> {
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim().toLowerCase();
  const message = (input.message ?? "").trim();

  if (
    !name ||
    !email ||
    !message ||
    name.length > CONTACT_LIMITS.name ||
    email.length > CONTACT_LIMITS.email ||
    message.length > CONTACT_LIMITS.message ||
    // Name feeds the email subject line — reject header-shaped input
    /[\r\n]/.test(name) ||
    !EMAIL_RE.test(email)
  ) {
    return { ok: false, code: "invalid" };
  }

  const remoteIp =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ||
    undefined;
  const verdict = await verifyTurnstileToken(
    input.turnstileToken ?? "",
    remoteIp,
  );
  if (verdict === "rejected") {
    return { ok: false, code: "verification" };
  }
  if (verdict === "unavailable") {
    // Not the visitor's fault — steer them to the errSend copy, which
    // carries the direct-email fallback link
    return { ok: false, code: "send" };
  }

  const locale = isValidLocale(input.locale) ? input.locale : defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "portfolio.contact",
  });

  const sent = await sendContactEmail({
    name,
    email,
    message,
    subject: t("mailSubject") + name,
  });
  return sent ? { ok: true } : { ok: false, code: "send" };
}
