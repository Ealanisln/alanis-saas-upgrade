"use client";
import Link from "next/link";
import type { SanityDocument } from "@sanity/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";

const builder = imageUrlBuilder(client);

export default function Posts({ posts = [] }: { posts: SanityDocument[] }) {
  console.log({posts});

  return (
    <>
      <div
        className="wow fadeInUp hover:shadow-two dark:hover:shadow-gray-dark group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 dark:bg-dark"
        data-wow-delay=".1s"
      >
        <Link
          href="/blog-details"
          className="relative block aspect-[37/22] w-full"
        >
          <span className="absolute right-6 top-6 z-20 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold capitalize text-white">
            {/* {tags[0]} */}
          </span>
          <Image src={posts.mainImage} alt="image" fill />
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3>
            <Link
              href="/blog-details"
              className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
            >
              {title}
            </Link>
          </h3>
          <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
            {paragraph}
          </p>
          <div className="flex items-center">
            <div className="mr-5 flex items-center border-r border-body-color border-opacity-10 pr-5 dark:border-white dark:border-opacity-10 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
              <div className="mr-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={author.image} alt="author" fill />
                </div>
              </div>
              <div className="w-full">
                <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                  By {author.name}
                </h4>
                <p className="text-xs text-body-color">{author.designation}</p>
              </div>
            </div>
            <div className="inline-block">
              <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                Date
              </h4>
              <p className="text-xs text-body-color">{publishDate}</p>
            </div>
          </div>
        </div>
      </div>
    </>
    // <div className="max-w-screen-lg mx-auto bg-babyblue" id="blog">
    //   <div className="mx-auto max-w-2xl py-20 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    //     <h3 className="text-4xl sm:text-5xl font-semibold text-black text-center my-10">
    //       Artículos de interés
    //     </h3>
    //     <h5 className="text-black opacity-60 text-lg font-normal text-center">
    //       ¡Bienvenido a nuestro blog veterinario! Explora artículos informativos
    //       y consejos expertos para mantener a tus mascotas felices y saludables.
    //       Estamos aquí para brindarte la mejor información sobre el cuidado y
    //       bienestar animal.
    //     </h5>

    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-4 lg:gap-x-8 mt-10">
    //       {posts.map((post) => (
    //         <Link
    //           key={post._id}
    //           href={`/blog/${post.slug.current}`}
    //           className="p-4 hover:bg-blue-50"
    //         >
    //           <div
    //             key={post._id}
    //             className="bg-white rounded-2xl p-5 featureShadow flex flex-col items-center"
    //           >
    //             {post?.mainImage ? (
    //               <Image
    //                 className="w-full h-auto rounded-lg"
    //                 src={builder
    //                   .image(post.mainImage)
    //                   .width(800) // Adjust the desired width
    //                   .height(600) // Adjust the desired height
    //                   .url()}
    //                 width={800}
    //                 height={600}
    //                 alt={post?.mainImage?.alt || ""}
    //               />
    //             ) : null}

    //             <h2 className="text-xl font-semibold text-black mt-5">
    //               {post.title}
    //             </h2>
    //           </div>
    //         </Link>
    //       ))}
    //     </div>
    //   </div>
    // </div>
  );
}
