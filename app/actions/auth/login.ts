"use server";

import { signIn } from "@/auth.config";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    });
    return "¡Autenticación exitosa!";
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Usuario o contraseña incorrectos.";
        default:
          return "Algo salió mal.";
      }
    }

    return "Error desconocido";
    // throw error;
  }
}

export const login = async(email: string, password: string) => {
  try {

    await signIn('credentials', { email, password})

    return { ok: true};

  } catch (error) {
      console.log(error);
      return {
        ok: false, 
        message: 'No se pudo iniciar sesión.'
      }
  }
}
