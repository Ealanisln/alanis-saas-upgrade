export const revalidate = 604800; // 7 dias

import { notFound } from "next/navigation";
import { titleFont } from "@/config/fonts";
import { ProductMobileSlideshow, ProductSlideshow } from "@/components/Product";
import { getProductBySlug } from "@/app/actions/products/";
import { Metadata, ResolvingMetadata } from "next";
import AddToCart from "./ui/AddToCart";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const product = await getProductBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title:
      (product?.title ?? "Product not was found ") +
      " | Alanis Web Saas ",
    description: product?.description ?? "",
    openGraph: {
      title: product?.title ?? "Producto no encontrado",
      description: product?.description ?? "",
      // images: [],
      images: [`/products/${product?.images[1]}`],
    },
  };
}

export default async function ProductBySlugPage({ params }: Props) {
  const { slug } = params;
  const product = await getProductBySlug(slug);


  if (!product) {
    notFound();
  }

  return (
    <div className="container">
      <div className="pt-32">
        <div className="mb-20 mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Slideshow */}
          <div className="col-span-1 md:col-span-2 ">
            {/* Mobile Slideshow */}
            <ProductMobileSlideshow
              title={product.title}
              images={product.images}
              className="block md:hidden"
            />

            {/* Desktop Slideshow */}
            <ProductSlideshow
              title={product.title}
              images={product.images}
              className="hidden md:block"
            />
          </div>

          {/* Detalles */}
          <div className="col-span-1 px-5">
            <h1
              className={` ${titleFont.className} text-xl font-bold antialiased`}
            >
              {product.title}
            </h1>
            <p className="mb-5 text-lg">${product.price}</p>

            <AddToCart product={product} />

            {/* Descripción */}
            <h3 className="text-sm font-bold">Descripción</h3>
            <p className="font-light">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
