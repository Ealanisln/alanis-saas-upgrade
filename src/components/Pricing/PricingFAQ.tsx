// src/components/Pricing/PricingFAQ.tsx

"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import SectionTitle from "../Common/SectionTitle";

const PricingFAQ = () => {
  const t = useTranslations("plans.faq");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleFaqToggle = (id: number) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  // Get FAQ items from translations
  const faqData = [0, 1, 2, 3, 4, 5].map((index) => ({
    id: index + 1,
    question: t(`items.${index}.question`),
    answer: t(`items.${index}.answer`),
  }));

  return (
    <section className="relative z-10 overflow-hidden bg-white pb-16 pt-16 dark:bg-black md:pb-20 md:pt-20 lg:pb-28 lg:pt-28">
      <div className="container">
        <SectionTitle
          title={t("title")}
          paragraph={t("subtitle")}
          center
          width="665px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-[#1D2144] lg:px-5 xl:px-8"
              data-wow-delay=".1s"
            >
              <button
                className={`flex w-full items-center justify-between ${
                  activeFaq === faq.id
                    ? "text-primary"
                    : "text-black dark:text-white"
                }`}
                onClick={() => handleFaqToggle(faq.id)}
              >
                <h3 className="text-base font-semibold sm:text-lg lg:text-base xl:text-lg">
                  {faq.question}
                </h3>
                <span className="dark:text-body-color-dark">
                  {activeFaq === faq.id ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-primary"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.41107 6.91074C4.73651 6.58529 5.26414 6.58529 5.58958 6.91074L10.0003 11.3214L14.4111 6.91074C14.7365 6.58529 15.2641 6.58529 15.5896 6.91074C15.915 7.23618 15.915 7.76381 15.5896 8.08926L10.5896 13.0893C10.2641 13.4147 9.73651 13.4147 9.41107 13.0893L4.41107 8.08926C4.08563 7.76381 4.08563 7.23618 4.41107 6.91074Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.5896 11.0893C15.2641 11.4147 14.7365 11.4147 14.411 11.0893L10.0002 6.67852L5.58946 11.0893C5.26402 11.4147 4.73638 11.4147 4.41094 11.0893C4.0855 10.7638 4.0855 10.2362 4.41094 9.91074L9.41094 4.91074C9.73638 4.5853 10.2641 4.5853 10.5895 4.91074L15.5896 9.91074C15.915 10.2362 15.915 10.7638 15.5896 11.0893Z"
                      />
                    </svg>
                  )}
                </span>
              </button>
              <div
                className={`pr-[10px] ${
                  activeFaq === faq.id ? "block" : "hidden"
                }`}
              >
                <p className="mt-4 text-body-color dark:text-body-color-dark">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/contact"
            className="rounded-md bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
          >
            {t("moreQuestions")}
          </Link>
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

export default PricingFAQ;