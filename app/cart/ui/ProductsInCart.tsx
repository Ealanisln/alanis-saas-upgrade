"use client";

import { useCartStore } from "@/store";
import React, { useEffect, useState } from "react";
import { ProductImage } from "@/components/Product/";
import Link from "next/link";

const ProductsInCart = () => {
  const removeProduct = useCartStore((state) => state.removeProduct);
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
        <div key={`${product.slug}`} className="mb-5 flex">
          <ProductImage
            src={product.image}
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
            <Link
              className="cursor-pointer hover:underline"
              href={`/product/${product.slug}`}
            >
              {product.title}
            </Link>
            <p>{product.price}</p>
            <button
              onClick={() => removeProduct(product)}
              className="mt-3 underline"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductsInCart;
