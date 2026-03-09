import { getTranslations } from "next-intl/server";
import { safeFetch } from "@/sanity/lib/client";
import { localizePost } from "@/sanity/lib/i18n";
import { SanityPost } from "@/sanity/lib/types";
import { SimpleBlogCard } from "@/types/simple-blog-card";
import Posts from "./Posts";

async function getData(locale: string): Promise<SimpleBlogCard[]> {
  const query = `
  *[_type == 'post'] | order(_updatedAt desc) [0...3] {
    _id,
    _updatedAt,
    title,
    slug,
    mainImage,
    smallDescription,
    author-> {
      _id,
      name
    }
  }
  `;
  const data = (await safeFetch(query)) as SanityPost[];

  return data
    .map((post) => localizePost(post, locale))
    .filter((post) => post !== null) as SimpleBlogCard[];
}

interface BlogProps {
  locale?: string;
}

const Blog = async ({ locale = "en" }: BlogProps = {}) => {
  const data: SimpleBlogCard[] = await getData(locale);
  const t = await getTranslations("home.blog");

  return (
    <section id="blog" className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <h2 className="mb-12 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          {t("title")}
        </h2>
        <Posts data={data} locale={locale} />
      </div>
    </section>
  );
};

export default Blog;
