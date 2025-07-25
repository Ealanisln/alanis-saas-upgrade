import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Server, Zap } from "lucide-react";
import { Link } from "@/lib/navigation";
import { getTranslations } from 'next-intl/server';

interface HeroSectionProps {
  locale: string;
}

export default async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return (
    <div className="relative min-h-[100dvh] w-full bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-dark">
      <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100dvh-5rem)] items-center">
          <div className="w-full py-12">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* Contenido */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                  {t('title')}
                </h1>
                <p className="mt-6 text-lg text-body-color dark:text-body-color-dark">
                  {t('description')}
                </p>

                {/* Botones */}
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Link href="/portfolio">
                    <Button className="h-14 rounded-xl bg-primary px-8 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark">
                      {t('cta')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="h-14 rounded-xl border-primary px-8 text-base font-medium text-primary shadow-submit duration-300 hover:bg-primary/5 dark:border-white dark:border-opacity-10 dark:text-white dark:shadow-submit-dark dark:hover:bg-white/5"
                    >
                      {t('contact')}
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
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="relative z-10 rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-dark">
                    <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]">
                      <Image
                        src="/images/hero/hero-light.svg"
                        alt="Hero illustration"
                        fill
                        className="dark:hidden"
                        priority
                      />
                      <Image
                        src="/images/hero/hero-dark.svg"
                        alt="Hero illustration"
                        fill
                        className="hidden dark:block"
                        priority
                      />
                    </div>
                  </div>
                  
                  {/* Elementos decorativos */}
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/20 blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-blue-500/20 blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
