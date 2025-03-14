// src/components/Pricing/PricingFAQ.tsx

"use client";
import { useState } from "react";
import SectionTitle from "../Common/SectionTitle";

const PricingFAQ = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const handleFaqToggle = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const faqData = [
    {
      id: 1,
      question: "¿Cuánto tiempo tarda en completarse un proyecto?",
      answer:
        "El tiempo de desarrollo varía según la complejidad del proyecto. Para un sitio básico (plan Lite), generalmente tomamos de 1 a 2 semanas. Para proyectos más complejos (planes Basic y Plus), el tiempo puede ser de 3 a 6 semanas. Siempre trabajamos con un cronograma detallado que compartimos contigo al inicio del proyecto.",
    },
    {
      id: 2,
      question: "¿Puedo actualizar mi plan más adelante?",
      answer:
        "¡Absolutamente! Hemos diseñado nuestros planes para que sean escalables. Puedes comenzar con un plan más básico y, a medida que tu negocio crece, actualizar a un plan más completo. El proceso de actualización es sencillo y te ayudaremos a migrar todos tus contenidos y configuraciones.",
    },
    {
      id: 3,
      question: "¿Qué incluye exactamente el soporte técnico?",
      answer:
        "Nuestro soporte técnico incluye asistencia para resolver problemas técnicos, actualizaciones de seguridad, pequeñas modificaciones de contenido y asesoramiento general sobre el uso de tu sitio web. El nivel de soporte varía según el plan: email para el plan Lite, email y teléfono para el Basic, y soporte prioritario 24/7 para el Plus.",
    },
    {
      id: 4,
      question: "¿Los precios incluyen hosting y dominio?",
      answer:
        "Sí, todos nuestros planes incluyen hosting y dominio por un año. Después del primer año, hay una tarifa anual para renovar estos servicios. Te notificaremos con anticipación sobre las fechas de renovación y te proporcionaremos opciones para continuar con nuestros servicios de hosting o migrar a otro proveedor si lo prefieres.",
    },
    {
      id: 5,
      question: "¿Ofrecen planes personalizados fuera de estas opciones?",
      answer:
        "Sí, entendemos que cada negocio tiene necesidades únicas. Si ninguno de nuestros planes estándar se adapta perfectamente a tus requerimientos, podemos crear un plan personalizado específicamente para ti. Contáctanos para una consulta gratuita y te proporcionaremos una cotización detallada basada en tus necesidades específicas.",
    },
    {
      id: 6,
      question: "¿Cómo funciona el proceso de pago?",
      answer:
        "Requerimos un depósito inicial del 50% para comenzar el proyecto. El 50% restante se paga una vez que el proyecto está completo y antes de la publicación final. Para proyectos más grandes o personalizados, podemos acordar un plan de pagos en etapas. Aceptamos transferencias bancarias, tarjetas de crédito y PayPal.",
    },
  ];

  return (
    <section className="relative z-10 overflow-hidden bg-white pb-16 pt-16 dark:bg-black md:pb-20 md:pt-20 lg:pb-28 lg:pt-28">
      <div className="container">
        <SectionTitle
          title="Preguntas Frecuentes"
          paragraph="¿Tienes dudas sobre nuestros servicios? Aquí encontrarás respuestas a las preguntas más comunes."
          center
          width="665px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-[#1D2144] lg:px-5 xl:px-8"
              data-wow-delay=".1s"
            >
              <button
                className={`flex w-full items-center justify-between ${
                  activeFaq === faq.id
                    ? "text-primary"
                    : "text-black dark:text-white"
                }`}
                onClick={() => handleFaqToggle(faq.id)}
              >
                <h3 className="text-base font-semibold sm:text-lg lg:text-base xl:text-lg">
                  {faq.question}
                </h3>
                <span className="dark:text-body-color-dark">
                  {activeFaq === faq.id ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-primary"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.41107 6.91074C4.73651 6.58529 5.26414 6.58529 5.58958 6.91074L10.0003 11.3214L14.4111 6.91074C14.7365 6.58529 15.2641 6.58529 15.5896 6.91074C15.915 7.23618 15.915 7.76381 15.5896 8.08926L10.5896 13.0893C10.2641 13.4147 9.73651 13.4147 9.41107 13.0893L4.41107 8.08926C4.08563 7.76381 4.08563 7.23618 4.41107 6.91074Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.5896 11.0893C15.2641 11.4147 14.7365 11.4147 14.411 11.0893L10.0002 6.67852L5.58946 11.0893C5.26402 11.4147 4.73638 11.4147 4.41094 11.0893C4.0855 10.7638 4.0855 10.2362 4.41094 9.91074L9.41094 4.91074C9.73638 4.5853 10.2641 4.5853 10.5895 4.91074L15.5896 9.91074C15.915 10.2362 15.915 10.7638 15.5896 11.0893Z"
                      />
                    </svg>
                  )}
                </span>
              </button>
              <div
                className={`pr-[10px] ${
                  activeFaq === faq.id ? "block" : "hidden"
                }`}
              >
                <p className="mt-4 text-body-color dark:text-body-color-dark">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <a
            href="/contacto"
            className="rounded-md bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
          >
            ¿Más preguntas? Contáctanos
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default PricingFAQ;