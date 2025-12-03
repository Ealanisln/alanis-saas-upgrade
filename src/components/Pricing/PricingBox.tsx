"use client";
import { useTranslations, useLocale } from "next-intl";
import { createCheckoutSession } from "@/app/actions/stripe";
import { CURRENCY } from "@/config";
import { formatAmountForStripe } from "@/lib/utils/stripe-helpers";

const PricingBox = (props: {
  price: number;
  packageName: string;
  subtitle: string;
  children: React.ReactNode;
  popular?: boolean;
}) => {
  const { price, packageName, subtitle, children, popular = false } = props;
  const t = useTranslations("plans.pricing");
  const locale = useLocale();

  const handleCheckout = async () => {
    const unitAmount = formatAmountForStripe(price, CURRENCY);
    await createCheckoutSession(unitAmount, packageName, locale);
  };

  return (
    <div
      className={`flex h-full w-full flex-col transition-transform duration-300 ${
        popular ? "lg:z-10 lg:scale-105" : ""
      }`}
    >
      <div
        className={`relative flex h-full flex-col rounded-2xl px-6 py-8 transition-all duration-300 sm:px-8 sm:py-10 ${
          popular
            ? "border-2 border-primary/50 bg-white/80 shadow-[0_8px_32px_rgba(79,122,250,0.25)] backdrop-blur-xl dark:border-primary/30 dark:bg-gray-900/70 dark:shadow-[0_8px_32px_rgba(79,122,250,0.15)]"
            : "border border-gray-200/50 bg-white/70 shadow-xl backdrop-blur-xl hover:shadow-2xl dark:border-white/10 dark:bg-gray-900/60 dark:hover:border-white/20"
        }`}
      >
        {popular && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-block rounded-full border border-primary/20 bg-primary/90 px-4 py-1.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
              {t("mostPopular")}
            </span>
          </div>
        )}

        {/* Plan Name */}
        <h4 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {packageName}
        </h4>

        {/* Price */}
        <div className="mb-4">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
            ${price.toLocaleString()}
            <span className="ml-1 text-base font-medium text-gray-500 dark:text-gray-400">
              USD
            </span>
          </h3>
        </div>

        {/* Subtitle */}
        <p className="mb-6 min-h-[40px] text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>

        {/* CTA Button */}
        <div className="mb-6">
          <form action={handleCheckout}>
            <button
              className={`flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold transition-all duration-300 ${
                popular
                  ? "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                  : "border border-gray-300 bg-white/50 text-gray-900 hover:border-primary hover:bg-primary hover:text-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-primary dark:hover:bg-primary"
              }`}
              type="submit"
            >
              {t("cta")}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="mb-6 border-t border-gray-200/50 dark:border-white/10" />

        {/* Features */}
        <div className="flex-grow space-y-3">{children}</div>
      </div>
    </div>
  );
};

export default PricingBox;
