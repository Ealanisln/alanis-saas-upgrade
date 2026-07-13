import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { groq } from "next-sanity";
import { Link } from "@/lib/navigation";
import { safeFetch, urlFor } from "@/sanity/lib/client";
import { getLocalizedValue } from "@/sanity/lib/i18n";
import type { SanityImage } from "@/sanity/lib/types";
import { Eyebrow } from "./Eyebrow";

interface I18nString {
  _key?: string;
  language?: string;
  value: string;
}

interface PortfolioPost {
  _id: string;
  _createdAt: string;
  title?: I18nString[];
  slug?: { current?: string };
  smallDescription?: I18nString[];
  mainImage?: SanityImage;
  publishedAt?: string;
  categories?: I18nString[][];
  bodyText?: string;
}

// Featured (latest) + 4 recent posts for the home blog section
const portfolioPostsQuery = groq`*[_type == "post" && defined(slug.current)]
  | order(coalesce(publishedAt, _createdAt) desc)[0...5]{
    _id,
    _createdAt,
    title,
    slug,
    smallDescription,
    mainImage,
    publishedAt,
    "categories": categories[]->title,
    "bodyText": pt::text(coalesce(
      body[_key == $locale][0].value,
      body[_key == "en"][0].value,
      body[0].value
    ))
  }`;

const formatDate = (iso: string | undefined, locale: string) => {
  if (!iso) return "";
  return new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
};

// ~200 wpm reading speed, minimum 1 minute
const readMinutes = (bodyText: string | undefined) =>
  Math.max(1, Math.round((bodyText?.trim().split(/\s+/).length ?? 0) / 200));

const localizePortfolioPost = (post: PortfolioPost, locale: string) => ({
  key: post._id,
  href: `/blog/${post.slug?.current ?? ""}`,
  title: getLocalizedValue(post.title, locale) ?? "Untitled",
  excerpt: getLocalizedValue(post.smallDescription, locale) ?? "",
  category: post.categories?.[0]
    ? (getLocalizedValue(post.categories[0], locale) ?? "")
    : "",
  date: formatDate(post.publishedAt ?? post._createdAt, locale),
  minutes: readMinutes(post.bodyText),
  image: post.mainImage,
  imageAlt: post.mainImage?.alt,
});

type CardPost = ReturnType<typeof localizePortfolioPost>;

const recentRow =
  "flex flex-col gap-[7px] border-b border-line px-0.5 py-[18px] text-inherit no-underline md:gap-2 md:px-1 md:py-5";
const recentMeta = "text-[12.5px] text-ink-4 md:text-[13px]";
const recentTitle =
  "text-base font-semibold leading-[1.4] tracking-[-0.01em] text-ink md:text-[17.5px] md:leading-[1.35]";

const BlogSection = async ({ locale }: { locale: string }) => {
  const t = await getTranslations("portfolio.blog");

  const raw = await safeFetch<PortfolioPost>(portfolioPostsQuery, { locale });
  const posts = raw.map((post) => localizePortfolioPost(post, locale));

  // Keep the reference sample copy as placeholder data until Sanity has posts
  const usingFallback = posts.length === 0;
  const featured: CardPost = usingFallback
    ? {
        key: "fallback-featured",
        href: "/blog",
        title: t("fallback.featured.title"),
        excerpt: t("fallback.featured.desc"),
        category: t("fallback.featured.category"),
        date: "",
        minutes: 0,
        image: undefined,
        imageAlt: undefined,
      }
    : posts[0];
  const recent: (CardPost & { fallbackMeta?: string })[] = usingFallback
    ? ([1, 2, 3, 4] as const).map((n) => ({
        key: `fallback-${n}`,
        href: "/blog",
        title: t(`fallback.post${n}.title`),
        excerpt: "",
        category: "",
        date: "",
        minutes: 0,
        image: undefined,
        imageAlt: undefined,
        fallbackMeta: t(`fallback.post${n}.meta`),
      }))
    : posts.slice(1, 5);

  const featuredMeta = usingFallback
    ? t("fallback.featured.meta")
    : `${featured.date} · ${t("minRead", { minutes: featured.minutes })}`;

  return (
    <section
      id="blog"
      className="mx-auto max-w-[1080px] px-5 py-14 md:px-6 md:py-[clamp(64px,9vw,112px)]"
    >
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <div className="md:flex md:flex-wrap md:items-end md:justify-between md:gap-6">
        <h2 className="mt-2.5 text-[26px] font-bold leading-[1.15] tracking-[-0.02em] md:mt-3 md:text-[clamp(28px,3.6vw,38px)]">
          {t("title")}
        </h2>
        <Link
          href="/blog"
          className="hidden items-center gap-1.5 text-[14.5px] font-semibold text-accent no-underline transition-colors hover:text-ink md:inline-flex"
        >
          {t("viewAll")} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <p className="mt-3.5 text-[15.5px] leading-[1.7] text-ink-3 [text-wrap:pretty] md:max-w-[560px] md:text-base md:leading-[1.65]">
        {t("intro")}
      </p>

      <div className="mt-7 md:mt-11 md:grid md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:items-stretch md:gap-[clamp(24px,3vw,32px)]">
        {/* Featured card */}
        <Link
          href={featured.href}
          className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card text-inherit no-underline md:transition-[transform,box-shadow] md:duration-[0.18s] md:hover:-translate-y-0.5 md:hover:shadow-card-hover"
        >
          <div className="relative aspect-video w-full border-b border-line bg-slot md:aspect-[16/8.5]">
            {featured.image && (
              <Image
                src={urlFor(featured.image).width(1200).height(638).url()}
                alt={featured.imageAlt ?? featured.title}
                fill
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-2.5 p-5 md:gap-3 md:px-7 md:pb-7 md:pt-[26px]">
            <div className="flex flex-wrap items-center gap-2.5">
              {featured.category && (
                <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-accent md:px-[11px] md:text-xs">
                  {featured.category}
                </span>
              )}
              <span className="text-[12.5px] text-ink-4 md:text-[13px]">
                {featuredMeta}
              </span>
            </div>
            <h3 className="text-[19px] font-bold leading-[1.3] tracking-[-0.01em] md:text-[clamp(20px,2.2vw,24px)] md:leading-[1.25] md:tracking-[-0.015em]">
              {featured.title}
            </h3>
            <p className="text-sm leading-[1.65] text-ink-3 [text-wrap:pretty] md:text-[15px]">
              <span className="md:hidden">
                {usingFallback ? t("fallback.featured.descShort") : featured.excerpt}
              </span>
              <span className="hidden md:inline">{featured.excerpt}</span>
            </p>
          </div>
        </Link>

        {/* Recent list — 4 rows on desktop, 3 on mobile */}
        <div className="mt-2.5 flex flex-col md:mt-0">
          {recent.map((post, index) => (
            <Link
              key={post.key}
              href={post.href}
              className={`${recentRow} ${index === recent.length - 1 ? "md:border-b-0" : ""} ${index === 3 ? "max-md:hidden" : ""}`}
            >
              <span className={recentMeta}>
                {post.fallbackMeta ??
                  [post.date, post.category].filter(Boolean).join(" · ")}
              </span>
              <span className={recentTitle}>{post.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/blog"
        className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-accent no-underline md:hidden"
      >
        {t("viewAll")} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
};

export default BlogSection;
