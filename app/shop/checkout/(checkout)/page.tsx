import React from "react";
import { Title } from "@/components/ui/";
import Link from "next/link";
import ProductsInCart from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";

const page = () => {
  return (
    <div className="my-32 flex items-center justify-center px-10 sm:px-0">
      <div className="w-[1000]px flex flex-col">
        <Title title="Verificar orden" />
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="mt-5 flex flex-col">
            <span className="mb-4 text-xl">Productos por ordenar</span>
            <Link href="/shop/cart" className="mb-5 underline">
              Editar carrito
            </Link>

            {/* Items */}
            <ProductsInCart />
          </div>
          <PlaceOrder />
        </div>
      </div>
    </div>
  );
};

export default page;
