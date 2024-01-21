"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/lib/utils/currencyFormat";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
      <h2 className="text-2xl mb-2">Resumen de orden</h2>
      <div className="grid grid-cols-2">
        <span>No. productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="text-2xl mt-5">Total</span>
        <span className="text-2xl mt-5 text-right">
          {currencyFormat(total)}
        </span>
      </div>
      <div className="mt-5 mb-2 w-full">
        <Link
          className="flex btn-primary justify-center"
          href="/checkout/address"
        >
          Ir al pago
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
