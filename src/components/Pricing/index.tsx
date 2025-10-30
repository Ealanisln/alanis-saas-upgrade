// src/components/Pricing/index.tsx

"use client";
import { useTranslations } from "next-intl";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";

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

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-12">
          <PricingBox
            packageName={t("lite.name")}
            price={6500}
            subtitle={t("lite.subtitle")}
          >
            <OfferList text={t("lite.features.pages")} status="active" />
            <OfferList text={t("lite.features.design")} status="active" />
            <OfferList text={t("lite.features.hosting")} status="active" />
            <OfferList text={t("lite.features.ssl")} status="active" />
            <OfferList text={t("lite.features.seo")} status="active" />
            <OfferList text={t("lite.features.support")} status="active" />
          </PricingBox>
          <PricingBox
            packageName={t("basic.name")}
            price={8500}
            subtitle={t("basic.subtitle")}
          >
            <OfferList text={t("basic.features.pages")} status="active" />
            <OfferList text={t("basic.features.design")} status="active" />
            <OfferList text={t("basic.features.hosting")} status="active" />
            <OfferList text={t("basic.features.blog")} status="active" />
            <OfferList text={t("basic.features.seo")} status="active" />
            <OfferList text={t("basic.features.support")} status="active" />
          </PricingBox>
          <PricingBox
            packageName={t("plus.name")}
            price={12500}
            subtitle={t("plus.subtitle")}
          >
            <OfferList text={t("plus.features.pages")} status="active" />
            <OfferList text={t("plus.features.design")} status="active" />
            <OfferList text={t("plus.features.cms")} status="active" />
            <OfferList text={t("plus.features.ecommerce")} status="active" />
            <OfferList text={t("plus.features.integrations")} status="active" />
            <OfferList text={t("plus.features.support")} status="active" />
          </PricingBox>
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
