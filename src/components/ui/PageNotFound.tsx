"use client";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { titleFont } from "@/config/fonts";
import { useTranslations } from "next-intl";

export const PageNotFound = () => {
  const t = useTranslations("common");
  return (
    <div className="flex flex-col-reverse md:flex-row h-[800px] w-full justify-center items-center align-middle">
      <div className="text-center px-5 mx-5">
        <h2 className={`${titleFont.className} antialiased text-8xl`}>404</h2>
        <p className="font-semibold text-xl">{t("notFound.title")}</p>
        <p className="font-light">
          <span>{t("notFound.message")} </span>
          <Link href="/" className="font-normal hover:underline transition-all">
            {t("notFound.homeLink")}
          </Link>
        </p>
      </div>
      <div className="px-5 mx-5">
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
