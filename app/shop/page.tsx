export const revalidate = 60; // 60 secs

import { getPaginatedProductsWithImages } from "@/app/actions/products/";
import { auth } from "@/auth.config";
import { ProductGrid } from "@/components/Shop/products/";
import Title from "@/components/ui/title/Title";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: string;
  };
}

// Remove parentheses here
export default async function Shop({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page });

  if (products.length === 0) {
    redirect("/");
  }

  return (
    <div className="container pt-32">
      <Title
        title="Our services"
        subtitle="From a static website to a e-commerce, choose the best option for you:"
      />
      <ProductGrid products={products} />
    </div>
  );
}
