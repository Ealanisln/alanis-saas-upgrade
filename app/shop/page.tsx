export const revalidate = 60; // 60 secs

import { getPaginatedProductsWithImages } from "@/app/actions/products/";
import { ProductGrid } from "@/components/Shop/products/";
// import Title from "@/components/ui/title/Title";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: string;
  };
}

// Remove parentheses here
export default async function Shop({ searchParams }: Props) {

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } =
  await getPaginatedProductsWithImages({ page });

  console.log(products);
  if (products.length === 0) {
    redirect("/");
  }

  return (
    <div className="container pt-32">
      {/* <Title title="Tienda" subtitle="Todos los productos" className="mb-2" /> */}
      <ProductGrid products={products} />
    </div>
  );
}
