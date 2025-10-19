// app/blog/[slug]/page.tsx
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import { portableTextComponents } from "@/components/Blog/PortableText";
import { client, urlFor } from "@/sanity/lib/client";
import { localizePost } from "@/sanity/lib/i18n";
import { FullPost } from "@/types/simple-blog-card";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getTranslations } from 'next-intl/server';

export const revalidate = 30;

// Generate metadata for this page
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; locale: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Await params since it's a Promise in Next.js 15
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  // Get post data
  const query = `
    *[_type == "post" && slug.current == $slug][0] {
      title,
      mainImage,
      smallDescription,
      publishedAt,
      "author": author->name
    }`;

  const rawPost = await client.fetch(query, { slug });

  // If no post found, return default metadata
  if (!rawPost) {
    return {
      title: "Post not found",
      description: "The requested blog post could not be found",
    };
  }

  // Localize the post
  const post = localizePost(rawPost, locale);

  // Get the post image URL
  const _imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : "/opengraph-image";

  // Create a description from post.smallDescription - ensure it's a string
  const description = (typeof post.smallDescription === 'string' ? post.smallDescription : t('meta.description'));
  const title = (typeof post.title === 'string' ? post.title : "Untitled");

  // Get parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  const postUrl = `https://alanis.dev/${locale}/blog/${slug}`;

  return {
    title: `${title} | Alanis Dev Blog`,
    description,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        'en-US': `/en/blog/${slug}`,
        'es-ES': `/es/blog/${slug}`,
      },
    },
    openGraph: {
      title: title,
      description: description,
      type: "article",
      locale: locale === 'en' ? "en_US" : "es_ES",
      url: postUrl,
      publishedTime: post.publishedAt || new Date().toISOString(),
      authors: [post.author || "Alanis Dev"],
      images: [
        {
          url: `/${locale}/blog/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [`/${locale}/blog/${slug}/opengraph-image`],
      creator: "@ealanisln",
    },
  };
}

// Define the page component
export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  // Await params since it's a Promise in Next.js 15
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const tNav = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch post data
  const query = `
    *[_type == "post" && slug.current == $slug][0] {
      "currentSlug": slug.current,
      title,
      body,
      mainImage,
      smallDescription,
      publishedAt,
      "author": author->name
    }`;

  const rawPost = await client.fetch(query, { slug });

  // Localize the post
  const post: FullPost = localizePost(rawPost, locale);

  // Ensure we have string values for title and description
  const title = (typeof post.title === 'string' ? post.title : "Untitled");
  const description = (typeof post.smallDescription === 'string' ? post.smallDescription : t('meta.description'));

  // Ensure body is properly extracted (it should be an array of blocks, not an i18n object)
  // If it's still an i18n object structure, try to extract the value
  let body: any = post.body;
  if (body && !Array.isArray(body) && typeof body === 'object' && 'value' in body) {
    body = (body as any).value;
  }
  if (!Array.isArray(body)) {
    body = [];
  }

  // Format date for display and structured data
  const publishDate = post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString();
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  // Create structured data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "image": post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : "https://alanis.dev/opengraph-image",
    "datePublished": publishDate,
    "dateModified": publishDate,
    "inLanguage": locale === 'en' ? 'en-US' : 'es-ES',
    "author": {
      "@type": "Person",
      "name": post.author || "Alanis Dev",
      "url": `https://alanis.dev/${locale}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Alanis Dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://alanis.dev/images/logo.png"
      }
    },
    "description": description,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://alanis.dev/${locale}/blog/${post.currentSlug}`
    }
  };

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: tNav('home'), url: `https://alanis.dev/${locale}` },
    { name: t('title'), url: `https://alanis.dev/${locale}/blog` },
    { name: title, url: `https://alanis.dev/${locale}/blog/${post.currentSlug}` }
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

      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <h1>
                <span className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  {title}
                </span>
              </h1>

              {/* Add publication date */}
              {formattedDate && (
                <div className="mt-2 mb-6 text-base text-body-color dark:text-body-color-dark">
                  {t('publishedOn')} {formattedDate}
                </div>
              )}

              {post.mainImage && (
                <Image
                  src={urlFor(post.mainImage).url()}
                  width={800}
                  height={800}
                  alt={title}
                  priority
                  className="mt-8 rounded-xl"
                />
              )}
              <div className="prose prose-xl prose-blue mt-16 dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
                <PortableText
                  value={body}
                  components={portableTextComponents}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}