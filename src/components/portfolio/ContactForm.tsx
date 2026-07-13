"use client";

import { useTranslations } from "next-intl";

/**
 * No backend — builds a mailto: URL exactly as specced:
 * subject "Opportunity for Emmanuel — from {name}",
 * body "{message}\n\n— {name} ({email})".
 */
const ContactForm = () => {
  const t = useTranslations("portfolio.contact");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = encodeURIComponent(
      t("mailSubject") + String(fd.get("name") ?? ""),
    );
    const body = encodeURIComponent(
      `${fd.get("message")}\n\n— ${fd.get("name")} (${fd.get("email")})`,
    );
    window.location.href = `mailto:emmanuel@alanis.dev?subject=${subject}&body=${body}`;
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
          maxLength={100}
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
          maxLength={200}
          placeholder={t("phEmail")}
          className={field}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-message" className={label}>
          {t("fMessage")}
        </label>
        {/* Keeps the URL-encoded mailto under OS handler limits (~2k chars) */}
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          maxLength={1200}
          placeholder={t("phMessage")}
          className={`${field} resize-y`}
        />
      </div>
      <button
        type="submit"
        className="cursor-pointer rounded-[10px] border-none bg-accent px-6 py-3.5 font-[inherit] text-[15px] font-semibold text-white transition-[filter] hover:brightness-[0.92] md:rounded-[9px] md:py-[13px]"
      >
        {t("fSend")}
      </button>
      <p className="text-center text-[12.5px] text-ink-4">{t("fNote")}</p>
    </form>
  );
};

export default ContactForm;
