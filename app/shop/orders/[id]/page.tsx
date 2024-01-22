import OrderStatus from "@/components/Shop/orders/OrderStatus";

import Image from "next/image";
import { getOrderById } from "@/app/actions/order/get-order-by-id";
import { redirect } from "next/navigation";
import { currencyFormat } from "@/lib/utils/currencyFormat";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { formatAmountForStripe } from "@/lib/utils/stripe-helpers";
import { createCheckoutSession } from "@/app/actions/stripe";
import { CURRENCY } from "@/config";
import StripeButton from "@/components/Stripe/StripeButton";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrdersByIdPage({ params }: Props) {
  const { id } = params;

  const { ok, order } = await getOrderById(id);

  console.log(order);

  if (!ok) {
    redirect("/");
  }

  return (
    <div className="pt-2">
      <Breadcrumb
        pageName="Order checkout"
        description="We accept apple pay or credit and debit cards, all transactions are handled by Stripe."
      />
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
            <div className="rounded-xl  bg-white p-6 shadow-xl dark:bg-gray-800">
              <h2 className="mb-2 text-2xl">Order details:</h2>

              <div className="grid grid-cols-2">
                <span>Products</span>
                <span className="text-right">
                  {order?.itemsInOrder === 1
                    ? "1 item"
                    : `${order?.itemsInOrder} items`}
                </span>

                <span>Subtotal</span>
                <span className="text-right">
                  {currencyFormat(order!.subTotal)}
                </span>

                <span>Tax 10%</span>
                <span className="text-right">{currencyFormat(order!.tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-right text-2xl">
                  {currencyFormat(order!.total)}
                </span>
              </div>

              <div className="mb-2 mt-5 w-full">
                <StripeButton
                  name={order.OrderItem[0].product.title}
                  amount={order.total}
                />

                {/* {order?.isPaid ? (
                <OrderStatus isPaid={order?.isPaid ?? false} />
              ) : (
                
                // <PayPalButton amount={order!.total} orderId={order!.id} />
              )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
