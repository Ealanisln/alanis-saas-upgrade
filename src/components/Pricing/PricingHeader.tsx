// src/components/Pricing/PricingHeader.tsx
"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

const PricingHeader = () => {
  const t = useTranslations("plans.header");

  return (
    <section className="relative z-10 overflow-hidden bg-primary/5 py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div className="wow fadeInUp max-w-[600px]" data-wow-delay=".2s">
              <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                {t("title")}
              </h1>
              <p className="mb-8 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed md:text-xl">
                {t("description")}
              </p>

              <div className="flex flex-wrap items-center">
                <a
                  href="#pricing"
                  className="mr-5 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-center text-base font-medium text-white hover:bg-primary/90"
                >
                  {t("viewPlans")}
                  <span className="pl-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.6663 10.8333L10.8329 16.6667L9.1663 15L12.9996 11.1667H3.33301V8.83333H12.9996L9.1663 5L10.8329 3.33333L16.6663 9.16667V10.8333Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border border-primary bg-transparent px-6 py-3 text-center text-base font-medium text-primary hover:bg-primary hover:text-white"
                >
                  {t("consultation")}
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            {/* <div className="wow fadeInUp relative mx-auto aspect-[25/24] max-w-[500px] lg:mr-0" data-wow-delay=".2s">
              <Image
                src="/images/hero/hero-image.svg"
                alt="imagen-precios"
                fill
                className="mx-auto max-w-full drop-shadow-three dark:hidden dark:drop-shadow-none lg:mr-0"
              />
              <Image
                src="/images/hero/hero-image-dark.svg"
                alt="imagen-precios"
                fill
                className="mx-auto hidden max-w-full drop-shadow-three dark:block dark:drop-shadow-none lg:mr-0"
              />
            </div> */}
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
        <svg
          width="450"
          height="556"
          viewBox="0 0 450 556"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="277"
            cy="63"
            r="225"
            fill="url(#paint0_linear_25:217)"
          ></circle>
          <circle
            cx="17.9997"
            cy="182"
            r="18"
            fill="url(#paint1_radial_25:217)"
          ></circle>
          <circle
            cx="76.9997"
            cy="288"
            r="34"
            fill="url(#paint2_radial_25:217)"
          ></circle>
          <circle
            cx="325.486"
            cy="302.87"
            r="180"
            transform="rotate(-37.6852 325.486 302.87)"
            fill="url(#paint3_linear_25:217)"
          ></circle>
          <circle
            opacity="0.8"
            cx="184.521"
            cy="315.521"
            r="132.862"
            transform="rotate(114.874 184.521 315.521)"
            stroke="url(#paint4_linear_25:217)"
          ></circle>
          <circle
            opacity="0.8"
            cx="356"
            cy="290"
            r="179.5"
            transform="rotate(-30 356 290)"
            stroke="url(#paint5_linear_25:217)"
          ></circle>
          <defs>
            <linearGradient
              id="paint0_linear_25:217"
              x1="277"
              y1="-162"
              x2="277"
              y2="363"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7"></stop>
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0"></stop>
            </linearGradient>
            <radialGradient
              id="paint1_radial_25:217"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
            >
              <stop stopColor="#4A6CF7"></stop>
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0"></stop>
            </radialGradient>
            <radialGradient
              id="paint2_radial_25:217"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
            >
              <stop stopColor="#4A6CF7"></stop>
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0"></stop>
            </radialGradient>
            <linearGradient
              id="paint3_linear_25:217"
              x1="325.486"
              y1="122.87"
              x2="325.486"
              y2="482.87"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7"></stop>
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0"></stop>
            </linearGradient>
            <linearGradient
              id="paint4_linear_25:217"
              x1="184.521"
              y1="182.159"
              x2="184.521"
              y2="448.882"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7"></stop>
              <stop offset="1" stopColor="white" stopOpacity="0"></stop>
            </linearGradient>
            <linearGradient
              id="paint5_linear_25:217"
              x1="356"
              y1="110"
              x2="356"
              y2="470"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7"></stop>
              <stop offset="1" stopColor="white" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default PricingHeader;
