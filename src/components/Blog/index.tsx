import { SimpleBlogCard } from "@/types/simple-blog-card";
import SectionTitle from "../Common/SectionTitle";
import Posts from "./Posts";
import { client } from "@/sanity/lib/client";
import { localizePost } from "@/sanity/lib/i18n";

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
  return data.map((post: any) => localizePost(post, locale));
}

interface BlogProps {
  locale?: string;
}

const Blog = async ({ locale = 'en' }: BlogProps = {}) => {
  const data: SimpleBlogCard[] = await getData(locale);

  return (
    <section
      id="blog"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Mis últimas publicaciones"
          paragraph="Descubre cosas nuevas sobre desarrollo web: lee artículos interesantes sobre la creación de sitios web y aplicaciones."
          center
        />

        <Posts data={data} />
      </div>
    </section>
  );
};

export default Blog;