import React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/client";
import { SimpleBlogCard } from "@/types/simple-blog-card";

interface PostsProps {
  data: SimpleBlogCard[];
  locale: string;
}

const Posts = ({ data, locale }: PostsProps) => {
  const sortedPosts = [...data]
    .filter((post) => post.slug?.current)
    .sort(
      (a, b) =>
        new Date(b._updatedAt).getTime() - new Date(a._updatedAt).getTime(),
    );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sortedPosts.map((post) => (
        <Link
          key={post._id}
          href={`/${locale}/blog/${post.slug?.current}`}
          className="group"
        >
          <article className="overflow-hidden rounded-lg border border-neutral-200 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={
                  post.mainImage
                    ? urlFor(post.mainImage).url()
                    : "/images/blog/placeholder.jpg"
                }
                alt={post.title || "Blog post image"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={false}
              />
            </div>

            <div className="p-5">
              <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
                {new Date(post._updatedAt).toLocaleDateString(
                  locale === "es" ? "es-ES" : "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  },
                )}
                {post.author?.name && <span> &middot; {post.author.name}</span>}
              </p>

              <h3 className="mb-2 line-clamp-2 text-base font-semibold text-neutral-900 group-hover:text-primary dark:text-white dark:group-hover:text-primary">
                {post.title}
              </h3>

              <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                {post.smallDescription}
              </p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
};

export default Posts;
