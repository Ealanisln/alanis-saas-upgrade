'use client';

import { useState } from "react";
import { deleteOrder } from "@/app/actions/order"; 

interface DeleteButtonProps {
  orderId: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ orderId }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteOrder = async () => {
    if (!isDeleting) {
      const confirmation = window.confirm(
        "¿Estás seguro de que deseas eliminar esta orden?"
      );

      if (confirmation) {
        setIsDeleting(true);

        try {
          const result = await deleteOrder(orderId);

          if (result.ok) {
            // Optionally redirect or handle success
            window.location.href = "/"; // Redirect to home page
          } else {
            // Handle error, display message, etc.
            console.error(result.message);
          }
        } finally {
          setIsDeleting(false);
        }
      }
    }
  };

  return (
    <button
      onClick={handleDeleteOrder}
      className={`bg-red-500 text-white px-2 py-2 rounded ${
        isDeleting ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isDeleting}
    >
      {isDeleting ? "Eliminando..." : "Eliminar Orden"}
    </button>
  );
};

export default DeleteButton;
