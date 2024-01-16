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
        console.log(`${key}: ${value}`);
        body += `<p>${key}: ${value}</p>`;
      }
    }
  
    const msg = {
      to: data.email,
      from: "emmanuel@alanis.dev",
      subject: "Website message - Alanis.dev",
      html: body,
    };
  
    sgMail.setApiKey(process.env.SEND_API_KEY || "");
  
    try {
      // await sgMail.send(msg);
      console.log("Message was sent successfully.");
      return "Message sent successfully"; 
    } catch (error) {
      throw new Error("Error sending email");
    }

  }

export default sendEmail;
