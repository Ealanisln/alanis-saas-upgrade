import Posts from "@/components/Blog/Posts";
import Breadcrumb from "@/components/Common/Breadcrumb";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import { client } from "@/sanity/lib/client";
import { localizePost } from "@/sanity/lib/i18n";
import { postPathsQuery } from "@/sanity/lib/queries";
import { SimpleBlogCard } from "@/types/simple-blog-card";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

export const revalidate = 30;

// Generate dynamic metadata based on locale
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: "website",
      locale: locale === 'en' ? "en_US" : "es_ES",
      url: `https://alanis.dev/${locale}/blog`,
      images: [
        {
          url: `/${locale}/blog/opengraph-image`,
          width: 1200,
          height: 630,
          alt: t('meta.title'),
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('meta.title'),
      description: t('meta.description'),
      images: [`/${locale}/blog/opengraph-image`],
    },
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        'en-US': '/en/blog',
        'es-ES': '/es/blog',
      },
    }
  };
}

// Prepare Next.js to know which routes already exist
export async function generateStaticParams() {
  // Important, use the plain Sanity Client here
  const posts = await client.fetch(postPathsQuery);
  return posts;
}

async function getData(locale: string) {
  const query = `
  *[_type == 'post'] | order(publishedAt desc) {
    _id,
    _updatedAt,
    title,
    slug,
    mainImage,
    smallDescription,
    publishedAt,
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

export default async function Blog({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const tNav = await getTranslations({ locale, namespace: 'navigation' });

  const data: SimpleBlogCard[] = await getData(locale);

  // Create structured data for the blog listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "headline": t('meta.title'),
    "description": t('meta.description'),
    "url": `https://www.alanis.dev/${locale}/blog`,
    "inLanguage": locale === 'en' ? 'en-US' : 'es-ES',
    "author": {
      "@type": "Person",
      "name": "Alanis Dev",
      "url": `https://www.alanis.dev/${locale}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Alanis Dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.alanis.dev/images/logo.png"
      }
    },
    "blogPosts": data.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://www.alanis.dev/${locale}/blog/${post.slug?.current || ''}`,
      "dateModified": post._updatedAt,
      "datePublished": post.publishedAt,
      "inLanguage": locale === 'en' ? 'en-US' : 'es-ES',
      "author": {
        "@type": "Person",
        "name": post.author?.name || "Alanis Dev"
      }
    }))
  };

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: tNav('home'), url: `https://www.alanis.dev/${locale}` },
    { name: t('title'), url: `https://www.alanis.dev/${locale}/blog` }
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
        pageName={t('title')}
        description={t('description')}
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
