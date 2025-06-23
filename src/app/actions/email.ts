'use server';

import { apiClient } from '@/lib/api/client';

interface FormInputs {
  name: string;
  email: string;
  message: string;
}

const sendEmail = async (data: FormInputs) => {
  try {
    const response = await apiClient.sendContactForm({
      name: data.name,
      email: data.email,
      message: data.message,
      subject: 'Nuevo mensaje desde Alanis.dev'
    });

    if (response.success) {
      return "Tu mensaje ha sido enviado correctamente. :)"; 
    } else {
      throw new Error(response.message || "Error al enviar el mensaje");
    }
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error("Ha ocurrido un error al enviar el mensaje.");
  }
}

export default sendEmail;
