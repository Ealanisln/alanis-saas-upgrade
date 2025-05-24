import Posts from "@/components/Blog/Posts";
import Breadcrumb from "@/components/Common/Breadcrumb";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import { client } from "@/sanity/lib/client";
import { postPathsQuery } from "@/sanity/lib/queries";
import { SimpleBlogCard } from "@/types/simple-blog-card";
import { Metadata } from "next";

export const revalidate = 30; 

export const metadata: Metadata = {
  title: "Blog sobre Desarrollo Web | Alanis Dev",
  description: "Descubre consejos, tutoriales y mejores prácticas sobre desarrollo web, Next.js, React, TypeScript y más. Artículos para desarrolladores de todos los niveles.",
  openGraph: {
    title: "Blog sobre Desarrollo Web | Alanis Dev",
    description: "Descubre consejos, tutoriales y mejores prácticas sobre desarrollo web, Next.js, React, TypeScript y más.",
    type: "website",
    images: [
      {
        url: "/images/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Alanis Dev Blog",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog sobre Desarrollo Web | Alanis Dev",
    description: "Descubre consejos, tutoriales y mejores prácticas sobre desarrollo web, Next.js, React, TypeScript y más.",
    images: ["/images/blog-og-image.jpg"],
  },
  alternates: {
    canonical: "/blog",
  }
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

  // Create structured data for the blog listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "headline": "Blog sobre Desarrollo Web | Alanis Dev",
    "description": "Descubre consejos, tutoriales y mejores prácticas sobre desarrollo web, Next.js, React, TypeScript y más.",
    "url": "https://alanis.dev/blog",
    "author": {
      "@type": "Person",
      "name": "Alanis Dev",
      "url": "https://alanis.dev/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Alanis Dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://alanis.dev/images/logo.png"
      }
    },
    "blogPosts": data.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://alanis.dev/blog/${post.slug?.current || ''}`,
      "dateModified": post._updatedAt,
      "author": {
        "@type": "Person",
        "name": post.author?.name || "Alanis Dev"
      }
    }))
  };

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: 'Inicio', url: 'https://alanis.dev' },
    { name: 'Blog', url: 'https://alanis.dev/blog' }
  ];

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Add breadcrumb structured data */}
      <BreadcrumbJsonLd items={breadcrumbItems} />

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
