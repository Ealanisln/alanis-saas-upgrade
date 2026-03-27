"use client";

import React, { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import sendEmail from "@/app/actions/email";

interface FormInputs {
  name: string;
  email: string;
  message: string;
}

interface Message {
  type: "success" | "error";
  text: string;
}

const Contact = () => {
  const t = useTranslations("contact.form");
  const locale = useLocale() as "en" | "es";
  const [message, setMessage] = useState<Message | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (turnstileSiteKey && !turnstileToken) {
      setMessage({
        type: "error",
        text: t("turnstileRequired") || "Please complete the verification",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendEmail(
        { ...data, locale },
        turnstileToken || undefined,
      );
      setMessage({ type: "success", text: result });

      turnstileRef.current?.reset();
      setTurnstileToken(null);

      setTimeout(() => {
        setMessage(null);
        reset();
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("errorMessage");
      setMessage({
        type: "error",
        text: `${t("errorMessage")} ${errorMessage}`,
      });

      turnstileRef.current?.reset();
      setTurnstileToken(null);

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-2 font-heading text-2xl font-bold text-t-text sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mb-10 text-t-muted">{t("subtitle")}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-t-text"
                >
                  {t("nameLabel")}
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  placeholder={t("namePlaceholder")}
                  className="w-full rounded-md border border-t-border bg-transparent px-4 py-3 text-sm text-t-text outline-none transition-colors focus:border-t-primary"
                />
                {errors.name && (
                  <span className="mt-1 text-xs text-red-500">
                    {t("required")}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-t-text"
                >
                  {t("emailLabel")}
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="w-full rounded-md border border-t-border bg-transparent px-4 py-3 text-sm text-t-text outline-none transition-colors focus:border-t-primary"
                />
                {errors.email && (
                  <span className="mt-1 text-xs text-red-500">
                    {t("required")}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-t-text"
              >
                {t("messageLabel")}
              </label>
              <textarea
                {...register("message", {
                  required: true,
                  maxLength: 500,
                })}
                name="message"
                rows={5}
                placeholder={t("messagePlaceholder")}
                className="w-full resize-none rounded-md border border-t-border bg-transparent px-4 py-3 text-sm text-t-text outline-none transition-colors focus:border-t-primary"
              />
              {errors.message && (
                <span className="text-xs text-red-500">{t("required")}</span>
              )}
              <p className="mt-1 text-xs text-t-muted">{t("maxChars")}</p>
            </div>

            {turnstileSiteKey && (
              <div>
                <Turnstile
                  ref={turnstileRef}
                  siteKey={turnstileSiteKey}
                  onSuccess={setTurnstileToken}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                  options={{
                    theme: "auto",
                    size: "normal",
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={
                isSubmitting || Boolean(turnstileSiteKey && !turnstileToken)
              }
              className="rounded-md bg-t-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? t("sending") || "Sending..." : t("submit")}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 rounded-md p-3 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
