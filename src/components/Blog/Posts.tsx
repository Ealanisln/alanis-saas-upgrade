import React from "react";
import { Card, CardContent } from "../ui";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import Link from "next/link";
import { SimpleBlogCard } from "@/types/simple-blog-card";

interface PostsProps {
  data: SimpleBlogCard[];
  locale: string;
}

const Posts = ({ data, locale }: PostsProps) => {
  // Ordenar los posts del más reciente al más viejo
  const sortedPosts = [...data].sort((a, b) => 
    new Date(b._updatedAt).getTime() - new Date(a._updatedAt).getTime()
  );

  return (
    <div className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-3 p-2">
      {sortedPosts.map((post) => (
        <Link
          key={post._id}
          href={`/${locale}/blog/${post.slug.current}`}
          className="group transition-all duration-300 hover:translate-y-[-5px] mb-6"
        >
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="relative h-48 md:h-56 overflow-hidden">
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.title || "Blog post image"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={false}
              />
            </div>
            
            <CardContent className="p-6 md:p-7">
              <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-primary dark:text-primary-light">
                  {new Date(post._updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="mx-2">•</span>
                <span>Por {post.author.name}</span>
              </div>
              
              <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-primary dark:text-white dark:group-hover:text-primary-light line-clamp-2">
                {post.title}
              </h3>
              
              <p className="mb-5 text-base text-gray-600 dark:text-gray-300 line-clamp-3">
                {post.smallDescription}
              </p>
              
              <div className="flex justify-end">
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline dark:text-primary-light">
                  Leer más
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
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