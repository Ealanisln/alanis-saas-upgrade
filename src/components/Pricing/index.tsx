// src/components/Pricing/index.tsx

"use client";

import { useTranslations } from "next-intl";
import SectionTitle from "../Common/SectionTitle";
import CustomQuoteSection from "./CustomQuoteSection";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";

const Pricing = () => {
  const t = useTranslations("plans.pricing");

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      {/* Gradient background orbs for glassmorphism effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl dark:bg-accent/5" />
      </div>

      <div className="container relative">
        <SectionTitle
          title={t("title")}
          paragraph={t("subtitle")}
          center
          width="665px"
        />

        <div className="mt-8 grid grid-cols-1 items-stretch gap-6 overflow-visible md:mt-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 xl:gap-6">
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
            <OfferList
              text={t("professional.features.database")}
              status="active"
            />
            <OfferList text={t("professional.features.auth")} status="active" />
            <OfferList
              text={t("professional.features.dashboard")}
              status="active"
            />
            <OfferList text={t("professional.features.api")} status="active" />
            <OfferList
              text={t("professional.features.support")}
              status="active"
            />
            <OfferList
              text={t("professional.features.delivery")}
              status="active"
            />
          </PricingBox>
          <PricingBox
            packageName={t("enterprise.name")}
            price={4200}
            subtitle={t("enterprise.subtitle")}
          >
            <OfferList
              text={t("enterprise.features.platform")}
              status="active"
            />
            <OfferList
              text={t("enterprise.features.payment")}
              status="active"
            />
            <OfferList
              text={t("enterprise.features.inventory")}
              status="active"
            />
            <OfferList
              text={t("enterprise.features.analytics")}
              status="active"
            />
            <OfferList
              text={t("enterprise.features.testing")}
              status="active"
            />
            <OfferList
              text={t("enterprise.features.support")}
              status="active"
            />
            <OfferList
              text={t("enterprise.features.delivery")}
              status="active"
            />
          </PricingBox>
        </div>

        {/* Currency conversion note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("currencyNote")}
          </p>
        </div>

        {/* Custom Quote Section */}
        <div className="mt-16">
          <CustomQuoteSection />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
