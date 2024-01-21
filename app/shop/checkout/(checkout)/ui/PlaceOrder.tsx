"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { placeOrder } from "@/app/actions/order";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/lib/utils/currencyFormat";
import { Button } from "@/components/ui";

export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation(),
  );
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
    }));

    //! Server Action
    const resp = await placeOrder(productsToOrder);
    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
      return;
    }

    //* Todo salio bien!
    clearCart();
    router.replace("/shop/orders/" + resp.order?.id);
  };

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="rounded-xl bg-white p-7 shadow-xl">
      <h2 className="mb-2 text-2xl">Order list</h2>

      <div className="grid grid-cols-2">
        <span>Products</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 item" : `${itemsInCart} items`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Tax (10%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-right text-2xl">
          {currencyFormat(total)}
        </span>
      </div>

      <div className="mb-2 mt-5 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            When you &quot;Confirm order&quot; you agree to our
            <a href="#" className="underline">
              terms and conditions
            </a>
            and
            <a href="#" className="underline">
              privacy policy
            </a>
          </span>
        </p>

        <p className="text-red-500">{errorMessage}</p>
        <div className="text-white">
        <Button
          onClick={onPlaceOrder}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
            "rounded-xl": true, // Add rounded-xl class for extra-large rounding
          })}
        >
          Place order
        </Button>
        </div>
      </div>
    </div>
  );
};
