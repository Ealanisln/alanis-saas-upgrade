"use client";

import { useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { submitContact } from "@/app/actions/contact";
import { CONTACT_LIMITS } from "@/lib/contact-limits";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = "idle" | "sending" | "success" | "error";

/**
 * Submits through the `submitContact` server action (Turnstile check +
 * Resend delivery). The Turnstile widget only renders when the site key is
 * configured; without it the action degrades to plain validation + send.
 */
const ContactForm = () => {
  const t = useTranslations("portfolio.contact");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<"errVerify" | "errSend">("errSend");
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const fd = new FormData(form);

    if (TURNSTILE_SITE_KEY && !token) {
      setErrorKey("errVerify");
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const result = await submitContact({
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        message: String(fd.get("message") ?? ""),
        locale,
        turnstileToken: token ?? undefined,
      });
      if (result.ok) {
        form.reset();
        setStatus("success");
      } else {
        setErrorKey(result.code === "verification" ? "errVerify" : "errSend");
        setStatus("error");
      }
    } catch {
      setErrorKey("errSend");
      setStatus("error");
    } finally {
      // Tokens are single-use — reissue for a follow-up submission
      turnstileRef.current?.reset();
      setToken(null);
    }
  };

  const field =
    "rounded-lg border border-line-2 bg-canvas px-3.5 py-3 font-[inherit] text-base text-ink outline-none transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_12%,transparent)] md:py-[11px] md:text-[15px]";
  const label = "text-[13.5px] font-semibold text-ink-2";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 flex flex-col gap-4 rounded-[14px] border border-line bg-card p-[22px] shadow-card md:mt-0 md:p-[clamp(24px,3vw,32px)]"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-name" className={label}>
          {t("fName")}
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          required
          maxLength={CONTACT_LIMITS.name}
          placeholder={t("phName")}
          className={field}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-email" className={label}>
          {t("fEmail")}
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          maxLength={CONTACT_LIMITS.email}
          placeholder={t("phEmail")}
          className={field}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-message" className={label}>
          {t("fMessage")}
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          maxLength={CONTACT_LIMITS.message}
          placeholder={t("phMessage")}
          className={`${field} resize-y`}
        />
      </div>
      {/* Wait for the resolved theme so the widget initializes once with the
          right palette; afterwards the key remounts it on user toggles (its
          own "auto" only tracks the OS preference, not the class theme) */}
      {TURNSTILE_SITE_KEY && resolvedTheme && (
        <Turnstile
          ref={turnstileRef}
          key={resolvedTheme}
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={setToken}
          onError={() => setToken(null)}
          onExpire={() => setToken(null)}
          options={{
            theme: resolvedTheme === "dark" ? "dark" : "light",
            size: "flexible",
          }}
        />
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="cursor-pointer rounded-[10px] border-none bg-accent px-6 py-3.5 font-[inherit] text-[15px] font-semibold text-white transition-[filter] hover:brightness-[0.92] disabled:cursor-default disabled:opacity-60 md:rounded-[9px] md:py-[13px]"
      >
        {status === "sending" ? t("fSending") : t("fSend")}
      </button>
      <p role="status" aria-live="polite" className="text-center text-[12.5px]">
        {status === "success" ? (
          <span className="font-medium text-accent">{t("fSuccess")}</span>
        ) : status === "error" ? (
          <span className="font-medium text-t-error">
            {t.rich(errorKey, {
              mail: (chunks) => (
                <a
                  href="mailto:emmanuel@alanis.dev"
                  className="underline underline-offset-2"
                >
                  {chunks}
                </a>
              ),
            })}
          </span>
        ) : (
          // Don't claim Turnstile protection when it isn't configured
          <span className="text-ink-4">
            {TURNSTILE_SITE_KEY ? t("fNote") : t("fNotePlain")}
          </span>
        )}
      </p>
    </form>
  );
};

export default ContactForm;
