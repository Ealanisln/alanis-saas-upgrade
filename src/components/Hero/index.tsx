import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Server, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-dark">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
              Creando Experiencias Digitales con Código
            </h1>
            <p className="mt-6 text-lg text-body-color dark:text-body-color-dark">
              Desarrollador full-stack especializado en crear aplicaciones web
              robustas, escalables y fáciles de usar. Desde el concepto hasta el
              despliegue, doy vida a tus ideas.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button className="h-14 w-full rounded-xl bg-primary px-9 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark sm:w-auto">
                Ver Mis Proyectos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-14 w-full rounded-xl border-primary px-9 text-base font-medium text-primary shadow-submit duration-300 hover:bg-primary/5 dark:border-white dark:border-opacity-10 dark:text-white dark:shadow-submit-dark dark:hover:bg-white/5 sm:w-auto"
              >
                Escríbeme
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex items-center">
                <Code className="mr-2 h-6 w-6 text-primary dark:text-white" />
                <span className="text-sm font-medium text-black dark:text-white">
                  Front-end
                </span>
              </div>
              <div className="flex items-center">
                <Server className="mr-2 h-6 w-6 text-primary dark:text-white" />
                <span className="text-sm font-medium text-black dark:text-white">
                  Back-end
                </span>
              </div>
              <div className="flex items-center">
                <Zap className="mr-2 h-6 w-6 text-primary dark:text-white" />
                <span className="text-sm font-medium text-black dark:text-white">
                  Full-stack
                </span>
              </div>
            </div>
          </div>
          <div className="relative lg:ml-auto">
            <div className="absolute inset-0 rounded-full bg-primary opacity-20 blur-3xl dark:opacity-10"></div>
            <Image
              src="/images/hero/hero-logo.svg"
              alt="Ilustración del Desarrollador"
              width={600}
              height={600}
              className="relative rounded-lg shadow-three transition duration-300 hover:shadow-one dark:shadow-two dark:hover:shadow-gray-dark"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
