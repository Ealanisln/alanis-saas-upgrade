import OrderStatus from "@/components/Shop/orders/OrderStatus";


import Image from "next/image";
import { getOrderById } from "@/app/actions/order/get-order-by-id";
import { redirect } from "next/navigation";
import { currencyFormat } from "@/lib/utils/currencyFormat";
import { Breadcrumb } from "@/components/";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrdersByIdPage({ params }: Props) {
  const { id } = params;

  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }

  return (
    <div className="pt-32">
      {/* <Breadcrumb
        pageName="Blog articles"
        description="Discover Cool Stuff About Web Development: Read Interesting Articles on Creating Websites and Apps."
      /> */}
    <div className="mb-72 flex items-center justify-center px-10 sm:px-0">
      <div className="flex w-[1000px] flex-col">
      
        {/* <Title title={`Orden #${id.split("-").at(-1)}`} /> */}

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {/* Carrito */}
          <div className="mt-5 flex flex-col">
            <OrderStatus isPaid={order?.isPaid ?? false} />

            {/* Items */}
            {order!.OrderItem.map((item) => (
              <div key={item.product.slug} className="mb-5 flex">
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                  alt={item.product.title}
                  className="mr-5 rounded"
                />

                <div>
                  <p>{item.product.title}</p>
                  <p>
                    ${item.price} x {item.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout - Resumen de orden */}
          <div className="rounded-xl bg-white p-7 shadow-xl">

            <h2 className="mb-2 text-2xl">Resumen de orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {order?.itemsInOrder === 1
                  ? "1 artículo"
                  : `${order?.itemsInOrder} artículos`}
              </span>

              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(order!.subTotal)}
              </span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-right text-2xl">
                {currencyFormat(order!.total)}
              </span>
            </div>

            <div className="mb-2 mt-5 w-full">
              
              {/* {order?.isPaid ? (
                <OrderStatus isPaid={order?.isPaid ?? false} />
              ) : (
                <PayPalButton amount={order!.total} orderId={order!.id} />
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
