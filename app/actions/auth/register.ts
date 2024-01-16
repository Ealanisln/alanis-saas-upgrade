"use server";

import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLocaleLowerCase(),
        password: bcryptjs.hashSync(password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    return {
      ok: true,
      user: user,
    };
  } catch (error:any) {
    console.log("Error al crear usuario:", error);

    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return {
        ok: false,
        message: "El correo electrónico ya está en uso, elige otro por favor. ",
      };
    }
  
    return {
      ok: false,
      message: "No se pudo crear el usuario",
    };
  }
};
