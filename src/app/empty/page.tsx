import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

const EmptyPage = () => {
  return (
    <div className="flex justify-center items-center h-[800px]">
      <ShoppingCart size={80} className="mx-5" /> 
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold">Your cart is empty.</h1>
        <Link href="/shop" className="text-blue-500 text-2xl">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default EmptyPage;
