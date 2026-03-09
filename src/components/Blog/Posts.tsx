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
          <article className="relative overflow-hidden rounded-md border border-t-border shadow-card transition-shadow duration-150 hover:shadow-card-hover">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-3 left-4 right-4 text-base font-semibold text-white">
                {post.title}
              </h3>
            </div>
            <div className="p-4">
              <p className="mb-1 font-mono text-xs text-t-muted">
                {new Date(post._updatedAt).toLocaleDateString(
                  locale === "es" ? "es-ES" : "en-US",
                  { year: "numeric", month: "short", day: "numeric" },
                )}
                {post.author?.name && <span> &middot; {post.author.name}</span>}
              </p>
              <p className="line-clamp-2 text-sm text-t-muted">
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
