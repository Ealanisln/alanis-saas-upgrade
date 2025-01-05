import clsx from "clsx";
import { CreditCard } from "lucide-react";
import React from "react";

interface Props {
    isPaid: boolean;
}

const OrderStatus = ({ isPaid}: Props ) => {
  return (
    <div
      className={clsx(
        "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
        {
          "bg-red-500": !isPaid,
          "bg-green-700": isPaid,
        }
      )}
    >
      <CreditCard size={30} />
      {/* <span className="mx-2">Pendiente de pago</span> */}
      <span className="mx-2">{isPaid ? "Pagada" : "No pagada"}</span>
    </div>
  );
};

export default OrderStatus;
