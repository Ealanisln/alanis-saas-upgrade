/**
 * Cloudflare Turnstile server-side verification
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

interface VerificationResult {
  success: boolean;
  error?: string;
}

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verify a Turnstile token server-side
 * @param token - The token from the Turnstile widget
 * @param remoteIp - Optional IP address of the user
 * @returns Verification result
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<VerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // If Turnstile is not configured, allow the request (graceful degradation)
  if (!secretKey) {
    console.warn(
      "TURNSTILE_SECRET_KEY not configured. Skipping Turnstile verification.",
    );
    return { success: true };
  }

  // If no token provided, reject
  if (!token) {
    return { success: false, error: "Turnstile verification required" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      console.error("Turnstile verification request failed:", response.status);
      return { success: false, error: "Verification service unavailable" };
    }

    const data: TurnstileVerifyResponse = await response.json();

    if (data.success) {
      return { success: true };
    } else {
      const errorCode = data["error-codes"]?.[0] || "unknown";
      console.error("Turnstile verification failed:", data["error-codes"]);
      return {
        success: false,
        error: getTurnstileErrorMessage(errorCode),
      };
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return { success: false, error: "Verification failed" };
  }
}

/**
 * Get user-friendly error message for Turnstile error codes
 */
function getTurnstileErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    "missing-input-secret": "Server configuration error",
    "invalid-input-secret": "Server configuration error",
    "missing-input-response": "Please complete the verification",
    "invalid-input-response": "Verification expired. Please try again.",
    "bad-request": "Verification failed",
    "timeout-or-duplicate":
      "Verification expired or already used. Please try again.",
    "internal-error": "Verification service error",
  };

  return errorMessages[errorCode] || "Verification failed. Please try again.";
}

/**
 * Check if Turnstile is configured
 */
export function isTurnstileConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
      process.env.TURNSTILE_SECRET_KEY,
  );
}
