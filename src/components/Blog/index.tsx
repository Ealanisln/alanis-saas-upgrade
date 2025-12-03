import { getTranslations } from "next-intl/server";
import { safeFetch } from "@/sanity/lib/client";
import { localizePost } from "@/sanity/lib/i18n";
import { SanityPost } from "@/sanity/lib/types";
import { SimpleBlogCard } from "@/types/simple-blog-card";
import SectionTitle from "../Common/SectionTitle";
import Posts from "./Posts";

async function getData(locale: string): Promise<SimpleBlogCard[]> {
  const query = `
  *[_type == 'post'] {
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

  // Localize all posts and filter out nulls
  return data
    .map((post) => localizePost(post, locale))
    .filter((post) => post !== null) as SimpleBlogCard[];
}

interface BlogProps {
  locale?: string;
}

const Blog = async ({ locale = "en" }: BlogProps = {}) => {
  const data: SimpleBlogCard[] = await getData(locale);
  const t = await getTranslations("blog.latest");

  return (
    <section
      id="blog"
      className="bg-gray-light py-16 dark:bg-bg-color-dark md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle title={t("title")} paragraph={t("description")} center />

        <Posts data={data} locale={locale} />
      </div>
    </section>
  );
};

export default Blog;
