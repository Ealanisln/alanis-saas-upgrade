"use client";

import sendEmail from "@/app/actions/email";
import { useForm, SubmitHandler } from "react-hook-form";
import React, { useState } from "react";

interface FormInputs {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [message, setMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const result = await sendEmail(data);
      // Handle confirmation here
      setMessage({ type: "success", text: result });

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage(null);
        reset();
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error sending email: " + error.message,
      });
      // Clear the error message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div
              className="wow fadeInUp mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s
              "
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Do you have any questions?
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                I will get back to you ASAP via email.
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Name
                      </label>
                      <input
                        {...register("name", { required: true })}
                        type="text"
                        placeholder="Enter your name"
                        className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                      {errors.name && <span>This field is required</span>}
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Email
                      </label>
                      <input
                        {...register("email", { required: true })}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                      {errors.email && <span>This field is required</span>}
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Message
                      </label>
                      <textarea
                        {...register("message", {
                          required: true,
                          maxLength: 500,
                        })}
                        name="message"
                        rows={5}
                        placeholder="Enter your Message"
                        className="w-full resize-none rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      >
                      </textarea>
                      {errors.email && <span>This field is required - </span>}
                      <span>Max: 500 characters</span>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button
                      type="submit"
                      className="rounded-xl bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </div>
              </form>
              {/* Display confirmation or error message */}
              {message && (
                <div
                  className={`mt-4 rounded p-3 ${
                    message.type === "success"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          </div>
          {/* <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Contact;
