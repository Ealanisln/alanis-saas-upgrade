"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { titleFont } from "@/config/fonts";
import { Link } from "@/lib/navigation";

export const PageNotFound = () => {
  const t = useTranslations("common");
  return (
    <div className="flex h-[800px] w-full flex-col-reverse items-center justify-center align-middle md:flex-row">
      <div className="mx-5 px-5 text-center">
        <h2 className={`${titleFont.className} text-8xl antialiased`}>404</h2>
        <p className="text-xl font-semibold">{t("notFound.title")}</p>
        <p className="font-light">
          <span>{t("notFound.message")} </span>
          <Link href="/" className="font-normal transition-all hover:underline">
            {t("notFound.homeLink")}
          </Link>
        </p>
      </div>
      <div className="mx-5 px-5">
        <Image
          src="/images/fatty-corgi.jpg"
          alt="Dog corgi sad"
          className="p-5 sm:p-0"
          width={550}
          height={550}
        />
      </div>
    </div>
  );
};
