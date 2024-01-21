"use client";

import { useCartStore } from "@/store";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { currencyFormat } from "@/lib/utils/currencyFormat";

const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p> Cargando... </p>;
  }

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}`} className="flex mb-5">
          <Image
            src={`/products/${product.image}`}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rounded"
          />
          <div>
            <span>
            {product.title} ({product.quantity})
            </span>
            <p className="font-bold">
              {currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductsInCart;
