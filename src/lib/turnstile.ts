/**
 * Cloudflare Turnstile server-side verification.
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

/**
 * "rejected" means the token itself failed (bot, expired, missing) — the
 * visitor should re-solve the challenge. "unavailable" means we couldn't
 * verify at all (siteverify down/timeout, or server misconfiguration) — the
 * visitor can't fix that by retrying the widget.
 */
export type TurnstileVerdict = "ok" | "rejected" | "unavailable";

/**
 * Verifies a widget token. Resolves "ok" without checking when Turnstile is
 * entirely unconfigured (no secret, no site key) so the contact form keeps
 * working in environments without Turnstile.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<TurnstileVerdict> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    // Fail closed when the widget is being served: a deployment that shows
    // the challenge must never silently skip verifying it
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      console.error(
        "NEXT_PUBLIC_TURNSTILE_SITE_KEY is set but TURNSTILE_SECRET_KEY is missing. Rejecting submission.",
      );
      return "unavailable";
    }
    const log =
      process.env.NODE_ENV === "production" ? console.error : console.warn;
    log(
      "TURNSTILE_SECRET_KEY not configured. Skipping Turnstile verification.",
    );
    return "ok";
  }

  if (!token) {
    // Mirror misconfiguration: secret set but no site key means the widget
    // never renders, so every visitor would arrive tokenless. Blaming them
    // ("re-solve the challenge") would dead-end the form.
    if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      console.error(
        "TURNSTILE_SECRET_KEY is set but NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing — the widget never renders. Treating verification as unavailable.",
      );
      return "unavailable";
    }
    return "rejected";
  }

  // Cloudflare tokens are ≤2048 chars; don't relay oversized payloads
  if (token.length > 2048) return "rejected";

  try {
    const body = new URLSearchParams({ secret: secretKey, response: token });
    if (remoteIp) body.append("remoteip", remoteIp);

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      // A hung siteverify must not pin the user's submit in "sending"
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error("Turnstile verification request failed:", response.status);
      return "unavailable";
    }

    const data: TurnstileVerifyResponse = await response.json();
    if (!data.success) {
      console.error("Turnstile verification failed:", data["error-codes"]);
      return "rejected";
    }
    return "ok";
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return "unavailable";
  }
}
