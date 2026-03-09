"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

interface ListProps {
  text: string;
}

const List = ({ text }: ListProps) => (
  <p className="mb-4 flex items-center text-base text-neutral-600 dark:text-neutral-400">
    <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
      {checkIcon}
    </span>
    {text}
  </p>
);

const AboutSectionOne = () => {
  const t = useTranslations("about.section");

  return (
    <section id="about" className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <div className="flex flex-wrap items-center gap-12 lg:flex-nowrap">
          <div className="w-full lg:w-1/2">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mb-8 text-neutral-600 dark:text-neutral-400">
              {t("description")}
            </p>

            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <List text={t("features.latestTech")} />
              <List text={t("features.scalable")} />
              <List text={t("features.worldClass")} />
              <List text={t("features.affordable")} />
              <List text={t("features.bilingual")} />
              <List text={t("features.friendly")} />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="relative mx-auto aspect-[25/24] max-w-[500px]">
              <Image
                src="/images/about/about-image.svg"
                alt="About illustration"
                fill
                priority
                className="object-contain dark:hidden"
              />
              <Image
                src="/images/about/about-image-dark.svg"
                alt="About illustration"
                fill
                priority
                className="hidden object-contain dark:block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionOne;
