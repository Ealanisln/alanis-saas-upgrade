import React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/client";
import { SimpleBlogCard } from "@/types/simple-blog-card";
import { Card, CardContent } from "../ui";

interface PostsProps {
  data: SimpleBlogCard[];
  locale: string;
}

const Posts = ({ data, locale }: PostsProps) => {
  // Ordenar los posts del más reciente al más viejo y filtrar posts sin slug válido
  const sortedPosts = [...data]
    .filter((post) => post.slug?.current) // Filter out posts without valid slug
    .sort(
      (a, b) =>
        new Date(b._updatedAt).getTime() - new Date(a._updatedAt).getTime(),
    );

  return (
    <div className="grid grid-cols-1 gap-8 p-2 sm:grid-cols-2 sm:gap-10 md:gap-12 lg:grid-cols-3">
      {sortedPosts.map((post) => (
        <Link
          key={post._id}
          href={`/${locale}/blog/${post.slug?.current}`}
          className="group mb-6 transition-all duration-300 hover:translate-y-[-5px]"
        >
          <Card className="overflow-hidden border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="relative h-48 overflow-hidden md:h-56">
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

            <CardContent className="p-6 md:p-7">
              <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="dark:text-primary-light font-medium text-primary">
                  {new Date(post._updatedAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {post.author?.name && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Por {post.author.name}</span>
                  </>
                )}
              </div>

              <h3 className="dark:group-hover:text-primary-light mb-3 line-clamp-2 text-xl font-bold text-gray-900 group-hover:text-primary dark:text-white">
                {post.title}
              </h3>

              <p className="mb-5 line-clamp-3 text-base text-gray-600 dark:text-gray-300">
                {post.smallDescription}
              </p>

              <div className="flex justify-end">
                <span className="dark:text-primary-light inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                  Leer más
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default Posts;
