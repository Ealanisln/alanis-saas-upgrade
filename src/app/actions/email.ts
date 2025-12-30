"use server";

import { sendContactEmail } from "@/lib/email";

interface FormInputs {
  name: string;
  email: string;
  message: string;
}

const sendEmail = async (data: FormInputs): Promise<string> => {
  // Basic validation
  if (!data.name || !data.email || !data.message) {
    throw new Error("All fields are required");
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("Invalid email format");
  }

  try {
    const result = await sendContactEmail({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      message: data.message.trim(),
      subject: `New contact from ${data.name}`,
    });

    if (result.success) {
      return "Your message has been sent successfully!";
    } else {
      console.error("Email sending failed:", result.error);
      throw new Error("Failed to send message. Please try again later.");
    }
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw new Error("An error occurred while sending your message.");
  }
};

export default sendEmail;
