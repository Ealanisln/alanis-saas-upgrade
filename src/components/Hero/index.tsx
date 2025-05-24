"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Server, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && theme === "dark"
      ? "/images/hero/hero-dark.svg"
      : "/images/hero/hero-light.svg";

  return (
    <div className="relative min-h-[100dvh] w-full bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-dark">
      <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100dvh-5rem)] items-center">
          <div className="w-full py-12">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* Contenido */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                  Creando Experiencias Digitales con Código
                </h1>
                <p className="mt-6 text-lg text-body-color dark:text-body-color-dark">
                  Desarrollador full-stack especializado en crear aplicaciones
                  web robustas, escalables y fáciles de usar. Desde el concepto
                  hasta el despliegue, doy vida a tus ideas.
                </p>

                {/* Botones */}
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Link href="/portafolio">
                    <Button className="h-14 rounded-xl bg-primary px-8 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark">
                      Ver Mis Proyectos <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="h-14 rounded-xl border-primary px-8 text-base font-medium text-primary shadow-submit duration-300 hover:bg-primary/5 dark:border-white dark:border-opacity-10 dark:text-white dark:shadow-submit-dark dark:hover:bg-white/5"
                    >
                      Escríbeme
                    </Button>
                  </Link>
                </div>

                {/* Iconos */}
                <div className="mt-12 flex flex-wrap justify-center gap-6 lg:justify-start">
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

              {/* Imagen */}
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="absolute inset-0 rounded-full bg-primary opacity-20 blur-3xl dark:opacity-10" />
                {mounted && (
                  <div className="relative w-full">
                    <Image
                      src={logoSrc}
                      alt="Ilustración del Desarrollador"
                      width={600}
                      height={600}
                      className="h-auto w-full rounded-lg object-contain shadow-three transition duration-300 hover:shadow-one dark:shadow-two dark:hover:shadow-gray-dark"
                      priority
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
