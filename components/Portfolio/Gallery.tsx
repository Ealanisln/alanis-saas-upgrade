"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export type Blog = {
  id: number;
  title: string;
  paragraph: string;
  image: string;
  location: Location;
  tags: string[];
  publishDate: string;
};

type Location = {
  url: string;
  image: string;
  designation: string;
};

export default function CarouselDemo() {
  const blogData: Blog[] = [
    {
      id: 6,
      title: "Chat PDF",
      paragraph:
        "Its a website where you will be able to interact with any PDF document using the Open AI power.",
      image: "/images/blog/blog-06.webp",
      location: {
        url: "https://www.charlapdf.pro",
        image: "/images/blog/yo.jpg",
        designation: "NextJS, OpenAI, postgreSQL",
      },
      tags: ["AI API"],
      publishDate: "2023",
    },
    {
      id: 5,
      title: "Cat Wiki",
      paragraph:
        "It was a project where I used NextJS to fetch data from thecatapi.com using server components and static site generation. The service is free for the first 5 queries and has a monthly payment for unlimited usage.",
      image: "/images/blog/blog-05.webp",
      location: {
        url: "https://cat-wiki-alanis.vercel.app/",
        image: "/images/blog/yo.jpg",
        designation: "NextJS, API, Tailwind CSS.",
      },
      tags: ["Static Site Generation"],
      publishDate: "2023",
    },
    {
      id: 4,
      title: "CEF",
      paragraph: "Drive its easy",
      image: "/images/blog/blog-01.webp",
      location: {
        url: "https://conducir-es-facil.vercel.app/",
        image: "/images/blog/yo.jpg",
        designation: "NextJS, Prisma, Supabase, Tailwind CSS.",
      },
      tags: ["Static Website"],
      publishDate: "2023",
    },
    {
      id: 3,
      title: "Alanis saas",
      paragraph:
        "This website offers web design packages, integrating the Stripe API as a payment gateway, sendgrid for contact form submissions, and ecommerce.",
      image: "/images/blog/blog-04.webp",
      location: {
        url: "https://www.alanis.dev/",
        image: "/images/blog/yo.jpg",
        designation: "NextJS, Tailwind, Clerk",
      },
      tags: ["Landing Page"],
      publishDate: "2023",
    },
    {
      id: 2,
      title: "Sierra Western Store",
      paragraph:
        "This is an online store created with NextJS 14, next-auth, prisma as database connector to a postgreSQL database. Paypal as payment gateway and zustand as state management solution.",
      image: "/images/blog/blog-03.webp",
      location: {
        url: "https://sierra-western.vercel.app/",
        image: "/images/blog/yo.jpg",
        designation: "NextJS, Next-auth, Prisma, Paypal",
      },
      tags: ["E-commerce"],
      publishDate: "2023",
    },
    {
      id: 1,
      title: "Family Vet",
      paragraph:
        "This static page was created for a veterinary clinic where various services are offered. I used Next.js, Tailwind for the design, and Sanity for blog management.",
      image: "/images/blog/blog-02.webp",
      location: {
        url: "https://www.vetforfamily.com",
        image: "/images/blog/yo.jpg",
        designation: "NextJS",
      },
      tags: ["Static website"],
      publishDate: "2023",
    },
  ];

  return (
    <div className="flex h-full items-center justify-center">
      <Carousel className="mx-auto w-full sm:w-3/4">
        <CarouselContent className="flex items-center">
          {blogData.map((blog) => (
            <CarouselItem key={blog.id}>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="py-2">
                      <span>{blog.title}</span>
                    </CardTitle>
                    <CardDescription className="py-2">
                      <span className="text-xl">{blog.paragraph}</span>
                      <div className="my-5 flex items-center">
                        <div className="flex-1 border-t border-gray-200"></div>
                      </div>
                      <div className="py-6">
                        <span className="text-lg">
                          Tech stack used: {blog.location.designation}
                        </span>
                      </div>
                    </CardDescription>
                    <CardFooter className="py-2"></CardFooter>
                  </CardHeader>
                  <Link href={blog.location.url} target="_blank">
                    <CardContent>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-auto w-full py-4"
                      />
                    </CardContent>
                  </Link>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
