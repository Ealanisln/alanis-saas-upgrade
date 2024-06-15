import { SimpleBlogCard } from "@/types/simple-blog-card";
import SectionTitle from "../Common/SectionTitle";
import Posts from "./Posts";
import { client } from "@/sanity/lib/client";

async function getData() {
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
  return data;
}

const Blog = async () => {
  const data: SimpleBlogCard[] = await getData();

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