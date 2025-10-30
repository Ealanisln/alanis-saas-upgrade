"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import sendEmail from "@/app/actions/email";

interface FormInputs {
  name: string;
  email: string;
  message: string;
}

interface Message {
  type: "success" | "error";
  text: string;
}

const Contact = () => {
  const t = useTranslations("contact.form");
  const [message, setMessage] = useState<Message | null>(null);

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
      const errorMessage =
        error instanceof Error ? error.message : t("errorMessage");
      setMessage({
        type: "error",
        text: `${t("errorMessage")} ${errorMessage}`,
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
                {t("title")}
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                {t("subtitle")}
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        {t("nameLabel")}
                      </label>
                      <input
                        {...register("name", { required: true })}
                        type="text"
                        placeholder={t("namePlaceholder")}
                        className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                      {errors.name && <span>{t("required")}</span>}
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        {t("emailLabel")}
                      </label>
                      <input
                        {...register("email", { required: true })}
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                      {errors.email && <span>{t("required")}</span>}
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        {t("messageLabel")}
                      </label>
                      <textarea
                        {...register("message", {
                          required: true,
                          maxLength: 500,
                        })}
                        name="message"
                        rows={5}
                        placeholder={t("messagePlaceholder")}
                        className="w-full resize-none rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      >
                      </textarea>
                      {errors.message && <span>{t("required")} - </span>}
                      <span>{t("maxChars")}</span>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button
                      type="submit"
                      className="rounded-xl bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                    >
                      {t("submit")}
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
