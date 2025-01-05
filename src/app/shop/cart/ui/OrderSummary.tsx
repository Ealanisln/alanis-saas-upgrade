"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/lib/utils/currencyFormat";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"

const OrderSummary = () => {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (itemsInCart === 0 && loaded === true) {
      router.replace("/empty");
    }
  }, [itemsInCart, loaded, router]);

  return (
    <div className="bg-white  dark:bg-gray-800 rounded-xl shadow-xl p-7 h-fit">
      <h2 className="text-2xl mb-2">Order summary</h2>
      <div className="grid grid-cols-2">
        <span>Products:</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 item" : `${itemsInCart} items`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Tax</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="text-2xl mt-5">Total</span>
        <span className="text-2xl mt-5 text-right">
          {currencyFormat(total)}
        </span>
      </div>
      <div className="mt-5 mb-2 w-full text-white">
        <Link
          className="flex justify-center"
          href="/shop/checkout/"
        >
          <Button className="rounded-xl">Go to payment</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
