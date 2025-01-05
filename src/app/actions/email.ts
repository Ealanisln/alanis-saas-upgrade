'use server';

import sgMail from "@sendgrid/mail";


interface FormInputs {
    name: string;
    email: string;
    message: string;
  }

const sendEmail = async( data: FormInputs) => {

    let body = `
      <p>Someone sent you a message from Alanis.dev:</p>
    `;
  
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        body += `<p>${key}: ${value}</p>`;
      }
    }
  
    const msg = {
      to: "ealanisln@me.com",
      from: "emmanuel@alanis.dev",
      subject: "Website message - Alanis.dev",
      html: body,
    };
  
    sgMail.setApiKey(process.env.SEND_API_KEY || "");
  
    try {
      await sgMail.send(msg);
      return "Tu mensaje ha sido enviado correctamente. :)"; 
    } catch (error) {
      throw new Error("Ha ocurrido un error al enviar el mensaje.");
    }

  }

export default sendEmail;
