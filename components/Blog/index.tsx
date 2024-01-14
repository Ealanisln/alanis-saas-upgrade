"use client";

import Link from "next/link";
import type { SanityDocument } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleBlog";
import blogData from "./blogData";

const builder = imageUrlBuilder(client);

export default function Posts({ posts = []}: { posts: SanityDocument[]})  {
  console.log(posts);
  return (
    <section
      id="blog"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Latest Blogs Posts"
          paragraph="There are some interesting information about software development."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="w-full">
              <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="p-4 hover:bg-blue-50"
            >
              <div
                key={post._id}
                className="bg-white rounded-2xl p-5 featureShadow flex flex-col items-center"
              >
                {post?.mainImage ? (
                  <Image
                    className="w-full h-auto rounded-lg"
                    src={builder
                      .image(post.mainImage)
                      .width(800) // Adjust the desired width
                      .height(600) // Adjust the desired height
                      .url()}
                    width={800}
                    height={600}
                    alt={post?.mainImage?.alt || ""}
                  />
                ) : null}

                <h2 className="text-xl font-semibold text-black mt-5">
                  {post.title}
                </h2>
              </div>
            </Link>
              
              {/* <SingleBlog blog={post} /> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


