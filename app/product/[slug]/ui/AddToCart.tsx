"use client";

import { CartProduct, Product } from "@/interfaces/store.interface";
import { useCartStore } from "@/store/";
import { useState } from "react";

interface Props {
  product: Product;
}

const AddToCart = ({ product }: Props) => {

  const addProductToCart = useCartStore( state => state.addProductToCart);

  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);

  const addToCart = () => {
    setPosted(true);
    console.log({  quantity, product})

    // Todo add to cart

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.images[0]
    }

    addProductToCart(cartProduct);

    setPosted(false);
    setQuantity(1);


  };

  return (
    <>
      {posted && (
        <span className="mt-2 text-red-500 fade-in">Debe seleccionar una talla*</span>
      )}


      {/* <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} /> */}

      {/* Button */}
      <button onClick={addToCart} className="btn-primary my-5">
        Agregar al carrito
      </button>
    </>
  );
};

export default AddToCart;
