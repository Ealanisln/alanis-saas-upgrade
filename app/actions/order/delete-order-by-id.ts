"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth.config";

export const deleteOrder = async (orderId: string) => {
  const session = await auth();
  const userId = session?.user.id;

  // Verificar sesión de usuario
  if (!userId) {
    return {
      ok: false,
      message: "No hay sesión de usuario",
    };
  }

  try {
    // Get the order to be deleted
    const orderToDelete = await prisma.order.findUnique({
      where: { id: orderId },
      include: { OrderItem: true },
    });

    // Check if the order exists and belongs to the user
    if (!orderToDelete || orderToDelete.userId !== userId) {
      return {
        ok: false,
        message: "La orden no existe o no pertenece al usuario",
      };
    }

    // Create a transaction to delete the order and related data
    const prismaTx = await prisma.$transaction(async (tx) => {
      // Delete order items
      await tx.orderItem.deleteMany({
        where: { orderId: orderId },
      });

      // Delete the order itself
      await tx.order.delete({
        where: { id: orderId },
      });

      return { success: true };
    });

    return {
      ok: true,
      message: "Orden eliminada correctamente",
      prismaTx: prismaTx,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message || "Error al intentar eliminar la orden",
    };
  }
};
