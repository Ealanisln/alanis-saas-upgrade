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
          title="Our Latest Blogs"
          paragraph="Discover Cool Stuff About Web Development: Read Interesting Articles on Creating Websites and Apps."
          center
        />

        <Posts data={data} />
      </div>
    </section>
  );
};

export default Blog;