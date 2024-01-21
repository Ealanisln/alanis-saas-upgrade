import { Title } from "@/components/ui/";
import Link from "next/link";
import React from "react";
import ProductsInCart from "./ui/ProductsInCart";
import OrderSummary from "./ui/OrderSummary";


const CartPage = () => {

  // redirect('/empty')

  return (
    <div className="pt-32">
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1400]px">
        <Title title="Shopping cart" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <span className="text-xl py-4">Edit cart</span>
            <Link href="/shop" className="underline mb-5">
              Add more items
            </Link>

            {/* Items */}

            <ProductsInCart />
            
          </div>

          {/* Checkout */}
          <OrderSummary />
        </div>
      </div>
    </div>
    </div>
  );
};

export default CartPage;