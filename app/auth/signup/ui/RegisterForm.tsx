"use client";

import { registerUser } from "@/app/actions/auth/register";
import { clsx } from "clsx";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage("");
    const { name, email, password } = data;

    const resp = await registerUser(name, email, password);

    if (!resp.ok) {
      setErrorMessage(resp.message || "Ocurrio un error"); // Use a default message if resp.message is undefined
      return;
    }

    // await login(email.toLowerCase(), password);
    window.location.replace("/");

    // server action
  };
  return (
    <div>
      <button
        onClick={() => signIn("google", { callbackUrl: "/profile" })}
        className="mb-6 flex w-full items-center justify-center rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none"
      >
        <span className="mr-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_95:967)">
              <path
                d="M20.0001 10.2216C20.0122 9.53416 19.9397 8.84776 19.7844 8.17725H10.2042V11.8883H15.8277C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2946 14.7577 13.7416 15.1327L13.722 15.257L16.7512 17.5567L16.961 17.5772C18.8883 15.8328 19.9997 13.266 19.9997 10.2216"
                fill="#4285F4"
              />
              <path
                d="M10.2042 20.0001C12.9592 20.0001 15.2721 19.1111 16.9616 17.5778L13.7416 15.1332C12.88 15.7223 11.7235 16.1334 10.2042 16.1334C8.91385 16.126 7.65863 15.7206 6.61663 14.9747C5.57464 14.2287 4.79879 13.1802 4.39915 11.9778L4.27957 11.9878L1.12973 14.3766L1.08856 14.4888C1.93689 16.1457 3.23879 17.5387 4.84869 18.512C6.45859 19.4852 8.31301 20.0005 10.2046 20.0001"
                fill="#34A853"
              />
              <path
                d="M4.39911 11.9777C4.17592 11.3411 4.06075 10.673 4.05819 9.99996C4.0623 9.32799 4.17322 8.66075 4.38696 8.02225L4.38127 7.88968L1.19282 5.4624L1.08852 5.51101C0.372885 6.90343 0.00012207 8.4408 0.00012207 9.99987C0.00012207 11.5589 0.372885 13.0963 1.08852 14.4887L4.39911 11.9777Z"
                fill="#FBBC05"
              />
              <path
                d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1826 0.901848 12.7366 -0.0298855 10.2042 -3.6784e-05C8.3126 -0.000477834 6.45819 0.514732 4.8483 1.48798C3.2384 2.46124 1.93649 3.85416 1.08813 5.51101L4.38775 8.02225C4.79132 6.82005 5.56974 5.77231 6.61327 5.02675C7.6568 4.28118 8.91279 3.87541 10.2042 3.86663Z"
                fill="#EB4335"
              />
            </g>
            <defs>
              <clipPath id="clip0_95:967">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </span>
        Sign up with Google
      </button>

      <div className="mb-8 flex items-center justify-center">
        <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
        <p className="w-full px-5 text-center text-base font-medium text-body-color">
          Or, register with your email
        </p>
        <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8">
          <label
            htmlFor="name"
            className="mb-3 block text-sm text-dark dark:text-white"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            className={clsx(
              "mb-5 rounded border bg-[#f8f8f8] px-5 py-2",
              {
                "border-2 border-red-600": errors.name,
              },
              "w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none",
            )}
            {...register("name", { required: true })}
          />
        </div>
        <div className="mb-8">
          <label
            htmlFor="email"
            className="mb-3 block text-sm text-dark dark:text-white"
          >
            {" "}
            Work Email{" "}
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            className={clsx(
              "mb-5 rounded border bg-[#f8f8f8] px-5 py-2",
              {
                "border-2 border-red-600": errors.email,
              },
              "w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none",
            )}
            {...register("email", {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
          />
        </div>
        <div className="mb-8">
          <label
            htmlFor="password"
            className="mb-3 block text-sm text-dark dark:text-white"
          >
            {" "}
            Your Password{" "}
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            className={clsx(
              "mb-5 rounded border bg-[#f8f8f8] px-5 py-2",
              {
                "border-2 border-red-600": errors.password,
              },
              "w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none",
            )}
            {...register("password", {
              required: true,
              minLength: 8,
            })}
          />
          <span className="my-4 text-red-500">{errorMessage}</span>
        </div>
        <div className="mb-8 flex">
          <label
            htmlFor="checkboxLabel"
            className="flex cursor-pointer select-none text-sm font-medium text-body-color"
          >
            <div className="relative">
              <input type="checkbox" id="checkboxLabel" className="sr-only" />
              <div className="box mr-4 mt-1 flex h-5 w-5 items-center justify-center rounded border border-body-color border-opacity-20 dark:border-white dark:border-opacity-10">
                <span className="opacity-0">
                  <svg
                    width="11"
                    height="8"
                    viewBox="0 0 11 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                      fill="#3056D3"
                      stroke="#3056D3"
                      strokeWidth="0.4"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <span>
              By creating account means you agree to the
              <a href="#0" className="text-primary hover:underline">
                Terms and Conditions
              </a>
              , and our
              <a href="#0" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>
        <div className="mb-6">
          <button className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark">
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
