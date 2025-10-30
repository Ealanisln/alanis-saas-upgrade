import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { localizePost } from "@/sanity/lib/i18n";
import type { SanityPost } from "@/sanity/lib/types";
import { SimpleBlogCard } from "@/types/simple-blog-card";
import SectionTitle from "../Common/SectionTitle";
import Posts from "./Posts";

async function getData(locale: string) {
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
  const data = await client.fetch(query);

  // Localize all posts
  return data.map((post: SanityPost) => localizePost(post, locale));
}

interface BlogProps {
  locale?: string;
}

const Blog = async ({ locale = 'en' }: BlogProps = {}) => {
  const data: SimpleBlogCard[] = await getData(locale);
  const t = await getTranslations("blog.latest");

  return (
    <section
      id="blog"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title={t("title")}
          paragraph={t("description")}
          center
        />

        <Posts data={data} locale={locale} />
      </div>
    </section>
  );
};

export default Blog;