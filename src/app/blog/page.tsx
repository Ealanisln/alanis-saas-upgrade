import Posts from "@/components/Blog/Posts";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { client } from "@/sanity/lib/client";
import { postPathsQuery } from "@/sanity/lib/queries";
import { SimpleBlogCard } from "@/types/simple-blog-card";
import { Metadata } from "next";

export const revalidate = 30; 

export const metadata: Metadata = {
  title: "Alanis Developer | Bienvenido a mi blog",
  description: "Descubre cosas interesantes sobre el desarrollo web: lea artículos sobre la creación de sitios web y aplicaciones.",
  // other metadata
};

// Prepare Next.js to know which routes already exist
export async function generateStaticParams() {
  // Important, use the plain Sanity Client here
  const posts = await client.fetch(postPathsQuery);
  return posts;
}

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

export default async function Blog() {
  const data: SimpleBlogCard[] = await getData();

  return (
    <>
      <Breadcrumb
        pageName="Articulos de blog"
        description="Descubre cosas interesantes sobre el desarrollo web: lea artículos sobre la creación de sitios web y aplicaciones."
      />
       <section className="pb-8 md:pb-16 pt-8 md:pt-16">
       <div className="container mx-auto">

       <div className="-mx-4 flex flex-wrap justify-center">
        <Posts data={data} />
      </div>
      </div>
      </section>
    </>
  );
}
