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
        "Es un sitio web donde podrás interactuar con cualquier documento PDF utilizando el poder de Open AI.",
      image: "/images/blog/blog-06.webp",
      location: {
        url: "https://www.charlapdf.pro",
        image: "/images/blog/yo.jpg",
        designation: "NextJS, OpenAI, postgreSQL",
      },
      tags: ["API de IA"],
      publishDate: "2023",
    },
    {
      id: 5,
      title: "Cat Wiki",
      paragraph:
        "Fue un proyecto donde utilicé NextJS para obtener datos de thecatapi.com usando componentes del servidor y generación de sitios estáticos. El servicio es gratuito para las primeras 5 consultas y tiene un pago mensual para uso ilimitado.",
      image: "/images/blog/blog-05.webp",
      location: {
        url: "https://cat-wiki-alanis.vercel.app/",
        image: "/images/blog/yo.jpg",
        designation: "NextJS, API, Tailwind CSS.",
      },
      tags: ["Generación de Sitios Estáticos"],
      publishDate: "2023",
    },
    {
      id: 4,
      title: "CEF",
      paragraph: "Conducir es fácil",
      image: "/images/blog/blog-01.webp",
      location: {
        url: "https://conducir-es-facil.vercel.app/",
        image: "/images/blog/yo.jpg",
        designation: "NextJS, Prisma, Supabase, Tailwind CSS.",
      },
      tags: ["Sitio Web Estático"],
      publishDate: "2023",
    },
    {
      id: 3,
      title: "Alanis saas",
      paragraph:
        "Este sitio web ofrece paquetes de diseño web, integrando la API de Stripe como pasarela de pago, sendgrid para el envío de formularios de contacto y ecommerce.",
      image: "/images/blog/blog-04.webp",
      location: {
        url: "https://www.alanis.dev/",
        image: "/images/blog/yo.jpg",
        designation: "NextJS, Tailwind, Clerk",
      },
      tags: ["Página de Aterrizaje"],
      publishDate: "2023",
    },
    {
      id: 2,
      title: "Sierra Western Store",
      paragraph:
        "Esta es una tienda en línea creada con NextJS 14, next-auth, prisma como conector de base de datos a una base de datos postgreSQL. Paypal como pasarela de pago y zustand como solución de gestión de estado.",
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
        "Esta página estática fue creada para una clínica veterinaria donde se ofrecen varios servicios. Utilicé Next.js, Tailwind para el diseño, y Sanity para la gestión del blog.",
      image: "/images/blog/blog-02.webp",
      location: {
        url: "https://www.vetforfamily.com",
        image: "/images/blog/yo.jpg",
        designation: "NextJS",
      },
      tags: ["Sitio web estático"],
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
