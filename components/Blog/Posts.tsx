import React from "react";
import { Card, CardContent } from "../ui";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import Link from "next/link";
import { SimpleBlogCard } from "@/types/simple-blog-card";

interface PostsProps {
  data: SimpleBlogCard[];
}

const Posts = ({ data }: PostsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {data.map((post, idx) => (
        <Link  key={post._id} href={`/blog/${post.slug.current}`}>
          <div key={idx}>
            <Card>
              <Image
                src={urlFor(post.mainImage).url()}
                alt="Blog post image"
                width={500}
                height={500}
                className="h-[200px] rounded-xl object-cover"
              />
            </Card>
            <CardContent className="mt-5">
              <h3 className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl">
                {post.title}
              </h3>
              <h2 className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                {post.smallDescription}
              </h2>
              <div className="flex items-center">
                <div className="mr-5 flex items-center border-r border-body-color border-opacity-10 pr-5 dark:border-white dark:border-opacity-10 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
                  <div className="mr-4">
                    <div className="w-full">
                      <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                        By {post.author.name}
                      </h4>

                      <p>{post._updatedAt.substring(0, 10)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Posts;
