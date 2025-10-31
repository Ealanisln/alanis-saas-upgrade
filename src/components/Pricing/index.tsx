// src/components/Pricing/index.tsx

"use client";
import { useTranslations } from "next-intl";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";
import CustomQuoteSection from "./CustomQuoteSection";

const Pricing = () => {
  const t = useTranslations("plans.pricing");

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title={t("title")}
          paragraph={t("subtitle")}
          center
          width="665px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4 mt-8 md:mt-12 items-stretch">
          <PricingBox
            packageName={t("starter.name")}
            price={500}
            subtitle={t("starter.subtitle")}
          >
            <OfferList text={t("starter.features.pages")} status="active" />
            <OfferList text={t("starter.features.design")} status="active" />
            <OfferList text={t("starter.features.hosting")} status="active" />
            <OfferList text={t("starter.features.ssl")} status="active" />
            <OfferList text={t("starter.features.seo")} status="active" />
            <OfferList text={t("starter.features.support")} status="active" />
            <OfferList text={t("starter.features.delivery")} status="active" />
          </PricingBox>
          <PricingBox
            packageName={t("business.name")}
            price={850}
            subtitle={t("business.subtitle")}
          >
            <OfferList text={t("business.features.pages")} status="active" />
            <OfferList text={t("business.features.design")} status="active" />
            <OfferList text={t("business.features.hosting")} status="active" />
            <OfferList text={t("business.features.blog")} status="active" />
            <OfferList text={t("business.features.seo")} status="active" />
            <OfferList text={t("business.features.support")} status="active" />
            <OfferList text={t("business.features.delivery")} status="active" />
          </PricingBox>
          <PricingBox
            packageName={t("professional.name")}
            price={2000}
            subtitle={t("professional.subtitle")}
            popular
          >
            <OfferList text={t("professional.features.app")} status="active" />
            <OfferList text={t("professional.features.database")} status="active" />
            <OfferList text={t("professional.features.auth")} status="active" />
            <OfferList text={t("professional.features.dashboard")} status="active" />
            <OfferList text={t("professional.features.api")} status="active" />
            <OfferList text={t("professional.features.support")} status="active" />
            <OfferList text={t("professional.features.delivery")} status="active" />
          </PricingBox>
          <PricingBox
            packageName={t("enterprise.name")}
            price={4200}
            subtitle={t("enterprise.subtitle")}
          >
            <OfferList text={t("enterprise.features.platform")} status="active" />
            <OfferList text={t("enterprise.features.payment")} status="active" />
            <OfferList text={t("enterprise.features.inventory")} status="active" />
            <OfferList text={t("enterprise.features.analytics")} status="active" />
            <OfferList text={t("enterprise.features.testing")} status="active" />
            <OfferList text={t("enterprise.features.support")} status="active" />
            <OfferList text={t("enterprise.features.delivery")} status="active" />
          </PricingBox>
        </div>

        {/* Currency conversion note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-body-color dark:text-gray-400 opacity-75">
            {t("currencyNote")}
          </p>
        </div>

        {/* Custom Quote Section */}
        <div className="mt-16">
          <CustomQuoteSection />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;
