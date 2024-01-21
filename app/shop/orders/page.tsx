// https://tailwindcomponents.com/component/hoverable-table
import { getOrdersByUser } from "@/app/actions/order";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { CreditCard } from "lucide-react";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const { ok, orders } = await getOrdersByUser();

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Breadcrumb
        pageName="My orders"
        description="Discover Cool Stuff About Web Development: Read Interesting Articles on Creating Websites and Apps."
      />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="border-b bg-gray-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-900"
              >
                #ID
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-900"
              >
                Nombre completo
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-900"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-900"
              >
                Opciones
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-900"
              >
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {orders!.map((order) => (
              <tr
                key={order.id}
                className="border-b bg-white transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {order.id.split("-").at(-1)}
                </td>
                <td className="flex items-center whitespace-nowrap  px-6 py-4 text-sm font-light text-gray-900">
                  {order.isPaid ? (
                    <>
                      <CreditCard className="text-green-800" />
                      <span className="mx-2 text-green-800">Pagada</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="text-red-800" />
                      <span className="mx-2 text-red-800">No Pagada</span>
                    </>
                  )}
                </td>
                <td className="px-6 text-sm font-light text-gray-900 ">
                  <Link
                    href={`/shop/orders/${order.id}`}
                    className="hover:underline"
                  >
                    Ver orden
                  </Link>
                </td>
                <td className="px-6 text-sm font-light text-gray-900 ">
                  {/* <DeleteButton orderId={order.id} /> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
